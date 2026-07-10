import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Request } from 'express';

import { AuditLogService } from '../audit/audit-log.service';
import {
  MedicoPaciente,
  StatusVinculo,
} from '../entities/medico-paciente.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { MedicoPacienteService } from './medico-paciente.service';

// ─── Factories ────────────────────────────────────────────────────────────────

const makePaciente = (overrides = {}) => ({
  userId: 'paciente-uuid-1',
  cpf: '123.456.789-00',
  dataNascimento: new Date('1990-01-01'),
  user: { id: 'paciente-uuid-1', name: 'João Silva', email: 'j@x.com' },
  ...overrides,
});

const makeMedico = (overrides = {}) => ({
  userId: 'medico-uuid-1',
  crm: 'CRM/SP 123456',
  especialidadeLegado: null,
  especialidades: [
    { id: 'esp-1', nome: 'Cardiologia', slug: 'cardiologia', ativa: true },
  ],
  user: { id: 'medico-uuid-1', name: 'Dra. Ana Lima' },
  ...overrides,
});

const makeVinculo = (overrides: Partial<MedicoPaciente> = {}) => ({
  medicoId: 'medico-uuid-1',
  pacienteId: 'paciente-uuid-1',
  status: StatusVinculo.APROVADO,
  solicitadoPor: 'medico-uuid-1',
  solicitadoEm: new Date('2024-01-01'),
  respondidoEm: new Date('2024-01-02'),
  vinculadoEm: new Date('2024-01-02'),
  termoVersao: 'v1',
  ...overrides,
});

const fakeRequest = { ip: '127.0.0.1', headers: {} } as unknown as Request;

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  insert: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockPacienteRepo = {
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockMedicoRepo = {
  findOne: jest.fn(),
};

const mockAudit = { registrar: jest.fn().mockResolvedValue(undefined) };

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('MedicoPacienteService', () => {
  let service: MedicoPacienteService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoPacienteService,
        { provide: getRepositoryToken(MedicoPaciente), useValue: mockRepo },
        { provide: getRepositoryToken(Paciente), useValue: mockPacienteRepo },
        { provide: getRepositoryToken(Medico), useValue: mockMedicoRepo },
        { provide: AuditLogService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<MedicoPacienteService>(MedicoPacienteService);
  });

  // ── solicitarVinculo() ────────────────────────────────────────────────────

  describe('solicitarVinculo()', () => {
    it('cria PENDENTE quando paciente existe e não há vínculo prévio', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.insert.mockResolvedValue(undefined);

      await service.solicitarVinculo(
        'medico-uuid-1',
        'paciente-uuid-1',
        fakeRequest,
      );

      expect(mockRepo.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          medicoId: 'medico-uuid-1',
          pacienteId: 'paciente-uuid-1',
          status: StatusVinculo.PENDENTE,
          solicitadoPor: 'medico-uuid-1',
        }),
      );
      expect(mockAudit.registrar).toHaveBeenCalledWith(
        'SOLICITACAO_VINCULO',
        'medico-uuid-1',
        'paciente-uuid-1',
        'SUCCESS',
        expect.anything(),
      );
    });

    it('lança NotFoundException quando paciente não existe', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(null);

      await expect(
        service.solicitarVinculo('medico-uuid-1', 'nope', fakeRequest),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepo.insert).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando já há PENDENTE', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({ status: StatusVinculo.PENDENTE }),
      );

      await expect(
        service.solicitarVinculo(
          'medico-uuid-1',
          'paciente-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('lança ConflictException quando já há APROVADO', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({ status: StatusVinculo.APROVADO }),
      );

      await expect(
        service.solicitarVinculo(
          'medico-uuid-1',
          'paciente-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('bloqueia nova solicitação dentro do cooldown após REJEITADO', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({
          status: StatusVinculo.REJEITADO,
          respondidoEm: new Date(),
        }),
      );

      await expect(
        service.solicitarVinculo(
          'medico-uuid-1',
          'paciente-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('reabre linha REJEITADO antiga (fora do cooldown) como PENDENTE', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({
          status: StatusVinculo.REJEITADO,
          respondidoEm: new Date('2020-01-01'),
        }),
      );
      mockRepo.update.mockResolvedValue({ affected: 1 });

      await service.solicitarVinculo(
        'medico-uuid-1',
        'paciente-uuid-1',
        fakeRequest,
      );

      expect(mockRepo.update).toHaveBeenCalledWith(
        { medicoId: 'medico-uuid-1', pacienteId: 'paciente-uuid-1' },
        expect.objectContaining({
          status: StatusVinculo.PENDENTE,
          respondidoEm: null,
          termoVersao: null,
        }),
      );
    });

    it('reabre linha REVOGADO como PENDENTE sem cooldown', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({
          status: StatusVinculo.REVOGADO,
          respondidoEm: new Date(),
        }),
      );
      mockRepo.update.mockResolvedValue({ affected: 1 });

      await expect(
        service.solicitarVinculo(
          'medico-uuid-1',
          'paciente-uuid-1',
          fakeRequest,
        ),
      ).resolves.toBeUndefined();
      expect(mockRepo.update).toHaveBeenCalled();
    });
  });

  // ── aprovarSolicitacao() ──────────────────────────────────────────────────

  describe('aprovarSolicitacao()', () => {
    it('aprova linha PENDENTE e grava termoVersao', async () => {
      mockRepo.update.mockResolvedValue({ affected: 1 });

      await service.aprovarSolicitacao(
        'paciente-uuid-1',
        'medico-uuid-1',
        fakeRequest,
      );

      expect(mockRepo.update).toHaveBeenCalledWith(
        {
          medicoId: 'medico-uuid-1',
          pacienteId: 'paciente-uuid-1',
          status: StatusVinculo.PENDENTE,
        },
        expect.objectContaining({
          status: StatusVinculo.APROVADO,
          termoVersao: expect.any(String),
        }),
      );
    });

    it('lança NotFoundException quando não há PENDENTE', async () => {
      mockRepo.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.aprovarSolicitacao(
          'paciente-uuid-1',
          'medico-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('paciente A não consegue aprovar solicitação de paciente B', async () => {
      // Simulação: pacienteId no update é o do JWT — se não coincide, affected=0
      mockRepo.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.aprovarSolicitacao(
          'paciente-uuid-outro',
          'medico-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── rejeitarSolicitacao() ─────────────────────────────────────────────────

  describe('rejeitarSolicitacao()', () => {
    it('marca REJEITADO quando linha está PENDENTE', async () => {
      mockRepo.update.mockResolvedValue({ affected: 1 });

      await service.rejeitarSolicitacao(
        'paciente-uuid-1',
        'medico-uuid-1',
        fakeRequest,
      );

      expect(mockRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: StatusVinculo.PENDENTE }),
        expect.objectContaining({ status: StatusVinculo.REJEITADO }),
      );
    });

    it('rejeitar linha já APROVADA falha (affected=0 → 404)', async () => {
      mockRepo.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.rejeitarSolicitacao(
          'paciente-uuid-1',
          'medico-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── revogarAcesso() ───────────────────────────────────────────────────────

  describe('revogarAcesso()', () => {
    it('revoga vínculo APROVADO', async () => {
      mockRepo.update.mockResolvedValue({ affected: 1 });

      await service.revogarAcesso(
        'paciente-uuid-1',
        'medico-uuid-1',
        fakeRequest,
      );

      expect(mockRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: StatusVinculo.APROVADO }),
        expect.objectContaining({ status: StatusVinculo.REVOGADO }),
      );
    });

    it('revogar linha PENDENTE falha (affected=0 → 404)', async () => {
      mockRepo.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.revogarAcesso(
          'paciente-uuid-1',
          'medico-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── desvincular() (médico) ────────────────────────────────────────────────

  describe('desvincular()', () => {
    it('cancela solicitação PENDENTE removendo linha', async () => {
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({ status: StatusVinculo.PENDENTE }),
      );
      mockRepo.delete.mockResolvedValue(undefined);

      await service.desvincular(
        'medico-uuid-1',
        'paciente-uuid-1',
        fakeRequest,
      );
      expect(mockRepo.delete).toHaveBeenCalled();
    });

    it('vínculo APROVADO vira REVOGADO', async () => {
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({ status: StatusVinculo.APROVADO }),
      );
      mockRepo.update.mockResolvedValue({ affected: 1 });

      await service.desvincular(
        'medico-uuid-1',
        'paciente-uuid-1',
        fakeRequest,
      );
      expect(mockRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: StatusVinculo.APROVADO }),
        expect.objectContaining({ status: StatusVinculo.REVOGADO }),
      );
    });

    it('desvincular linha REJEITADO/REVOGADO lança NotFound', async () => {
      mockRepo.findOne.mockResolvedValue(
        makeVinculo({ status: StatusVinculo.REJEITADO }),
      );
      await expect(
        service.desvincular(
          'medico-uuid-1',
          'paciente-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('sem linha alguma → NotFound', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.desvincular(
          'medico-uuid-1',
          'paciente-uuid-1',
          fakeRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── meusPacientes() ──────────────────────────────────────────────────────

  describe('meusPacientes()', () => {
    it('filtra apenas vínculos APROVADO', async () => {
      mockRepo.find.mockResolvedValue([]);
      await service.meusPacientes('medico-uuid-1');
      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            medicoId: 'medico-uuid-1',
            status: StatusVinculo.APROVADO,
          },
        }),
      );
    });

    it('projeta campos esperados', async () => {
      mockRepo.find.mockResolvedValue([
        { ...makeVinculo(), paciente: makePaciente() },
      ]);
      const result = await service.meusPacientes('medico-uuid-1');
      expect(result[0]).toMatchObject({
        pacienteId: 'paciente-uuid-1',
        nome: 'João Silva',
      });
    });
  });

  // ── meusMedicos() ────────────────────────────────────────────────────────

  describe('meusMedicos()', () => {
    it('filtra apenas vínculos APROVADO', async () => {
      mockRepo.find.mockResolvedValue([]);
      await service.meusMedicos('paciente-uuid-1');
      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            pacienteId: 'paciente-uuid-1',
            status: StatusVinculo.APROVADO,
          },
        }),
      );
    });
  });

  // ── solicitacoesPendentesParaPaciente() ──────────────────────────────────

  describe('solicitacoesPendentesParaPaciente()', () => {
    it('filtra por PENDENTE + pacienteId', async () => {
      mockRepo.find.mockResolvedValue([]);
      await service.solicitacoesPendentesParaPaciente('paciente-uuid-1');
      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            pacienteId: 'paciente-uuid-1',
            status: StatusVinculo.PENDENTE,
          },
        }),
      );
    });

    it('projeta médico + especialidades', async () => {
      mockRepo.find.mockResolvedValue([
        {
          ...makeVinculo({ status: StatusVinculo.PENDENTE }),
          medico: makeMedico(),
        },
      ]);
      const result = await service.solicitacoesPendentesParaPaciente(
        'paciente-uuid-1',
      );
      expect(result[0]).toMatchObject({
        medicoId: 'medico-uuid-1',
        medicoNome: 'Dra. Ana Lima',
        especialidades: [{ id: 'esp-1', nome: 'Cardiologia' }],
      });
    });
  });
});
