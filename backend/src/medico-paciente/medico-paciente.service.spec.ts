import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MedicoPacienteService } from './medico-paciente.service';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';

// ─── Factories ────────────────────────────────────────────────────────────────

const makePaciente = (overrides = {}) => ({
  userId: 'paciente-uuid-1',
  cpf: '123.456.789-00',
  dataNascimento: new Date('1990-01-01'),
  user: { id: 'paciente-uuid-1', name: 'João Silva' },
  ...overrides,
});

const makeMedico = (overrides = {}) => ({
  userId: 'medico-uuid-1',
  crm: 'CRM/SP 123456',
  especialidade: 'Cardiologia',
  user: { id: 'medico-uuid-1', name: 'Dra. Ana Lima' },
  ...overrides,
});

const makeVinculo = (overrides = {}): Partial<MedicoPaciente> => ({
  medicoId: 'medico-uuid-1',
  pacienteId: 'paciente-uuid-1',
  vinculadoEm: new Date('2024-01-01'),
  ...overrides,
});

// ─── Mocks dos repositórios ───────────────────────────────────────────────────

const mockRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockPacienteRepo = {
  findOne: jest.fn(),
};

const mockMedicoRepo = {
  findOne: jest.fn(),
};

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
      ],
    }).compile();

    service = module.get<MedicoPacienteService>(MedicoPacienteService);
  });

  // ── vincular() ──────────────────────────────────────────────────────────────

  describe('vincular()', () => {
    it('deve criar o vínculo quando paciente existe e vínculo ainda não existe', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(makeVinculo());
      mockRepo.save.mockResolvedValue(undefined);

      await expect(
        service.vincular('medico-uuid-1', 'paciente-uuid-1'),
      ).resolves.toBeUndefined();

      expect(mockRepo.create).toHaveBeenCalledWith({
        medicoId: 'medico-uuid-1',
        pacienteId: 'paciente-uuid-1',
      });
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando o paciente não existe', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(null);

      await expect(
        service.vincular('medico-uuid-1', 'paciente-uuid-inexistente'),
      ).rejects.toThrow(NotFoundException);

      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando o vínculo já existe', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(makeVinculo());

      await expect(
        service.vincular('medico-uuid-1', 'paciente-uuid-1'),
      ).rejects.toThrow(ConflictException);

      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('a mensagem de erro para paciente inexistente deve ser clara', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(null);

      await expect(
        service.vincular('medico-uuid-1', 'paciente-uuid-inexistente'),
      ).rejects.toThrow('Paciente não encontrado.');
    });

    it('a mensagem de erro para vínculo duplicado deve ser clara', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(makePaciente());
      mockRepo.findOne.mockResolvedValue(makeVinculo());

      await expect(
        service.vincular('medico-uuid-1', 'paciente-uuid-1'),
      ).rejects.toThrow('Vínculo já existe entre este médico e paciente.');
    });
  });

  // ── desvincular() ───────────────────────────────────────────────────────────

  describe('desvincular()', () => {
    it('deve remover o vínculo quando ele existe', async () => {
      const vinculo = makeVinculo();
      mockRepo.findOne.mockResolvedValue(vinculo);
      mockRepo.remove.mockResolvedValue(undefined);

      await expect(
        service.desvincular('medico-uuid-1', 'paciente-uuid-1'),
      ).resolves.toBeUndefined();

      expect(mockRepo.remove).toHaveBeenCalledWith(vinculo);
    });

    it('deve lançar NotFoundException quando o vínculo não existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.desvincular('medico-uuid-1', 'paciente-uuid-1'),
      ).rejects.toThrow(NotFoundException);

      expect(mockRepo.remove).not.toHaveBeenCalled();
    });

    it('a mensagem de erro para vínculo inexistente deve ser clara', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.desvincular('medico-uuid-1', 'paciente-uuid-1'),
      ).rejects.toThrow('Vínculo não encontrado.');
    });

    it('médico que não faz parte do vínculo não consegue desvincular', async () => {
      // O medicoId passado é diferente do que está no vínculo — o repo retorna null
      // porque a query filtra por { medicoId, pacienteId } simultaneamente
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.desvincular('outro-medico-uuid', 'paciente-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── meusPacientes() ─────────────────────────────────────────────────────────

  describe('meusPacientes()', () => {
    it('deve retornar lista de pacientes vinculados ao médico', async () => {
      const vinculo = {
        ...makeVinculo(),
        paciente: makePaciente(),
      };
      mockRepo.find.mockResolvedValue([vinculo]);

      const result = await service.meusPacientes('medico-uuid-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        pacienteId: 'paciente-uuid-1',
        nome: 'João Silva',
        vinculadoEm: vinculo.vinculadoEm,
      });
    });

    it('deve retornar lista vazia quando médico não tem pacientes', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.meusPacientes('medico-uuid-sem-pacientes');

      expect(result).toEqual([]);
    });

    it('não deve expor campos sensíveis do paciente (cpf, passwordHash)', async () => {
      const vinculo = {
        ...makeVinculo(),
        paciente: {
          ...makePaciente(),
          user: { id: 'paciente-uuid-1', name: 'João Silva', passwordHash: 'hash-secreto', cpf: '123.456.789-00' },
        },
      };
      mockRepo.find.mockResolvedValue([vinculo]);

      const result = await service.meusPacientes('medico-uuid-1');

      expect(result[0]).not.toHaveProperty('passwordHash');
      expect(result[0]).not.toHaveProperty('cpf');
    });

    it('deve buscar apenas pacientes do médico autenticado', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.meusPacientes('medico-uuid-1');

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { medicoId: 'medico-uuid-1' } }),
      );
    });
  });

  // ── meusMedicos() ───────────────────────────────────────────────────────────

  describe('meusMedicos()', () => {
    it('deve retornar lista de médicos vinculados ao paciente', async () => {
      const vinculo = {
        ...makeVinculo(),
        medico: makeMedico(),
      };
      mockRepo.find.mockResolvedValue([vinculo]);

      const result = await service.meusMedicos('paciente-uuid-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        medicoId: 'medico-uuid-1',
        nome: 'Dra. Ana Lima',
        especialidade: 'Cardiologia',
        vinculadoEm: vinculo.vinculadoEm,
      });
    });

    it('deve retornar lista vazia quando paciente não tem médicos', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.meusMedicos('paciente-uuid-sem-medicos');

      expect(result).toEqual([]);
    });

    it('não deve expor campos sensíveis do médico (crm, passwordHash)', async () => {
      const vinculo = {
        ...makeVinculo(),
        medico: {
          ...makeMedico(),
          crm: 'CRM/SP 123456',
          user: { id: 'medico-uuid-1', name: 'Dra. Ana Lima', passwordHash: 'hash-secreto' },
        },
      };
      mockRepo.find.mockResolvedValue([vinculo]);

      const result = await service.meusMedicos('paciente-uuid-1');

      expect(result[0]).not.toHaveProperty('passwordHash');
      expect(result[0]).not.toHaveProperty('crm');
    });

    it('deve buscar apenas médicos do paciente autenticado', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.meusMedicos('paciente-uuid-1');

      expect(mockRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { pacienteId: 'paciente-uuid-1' } }),
      );
    });
  });
});
