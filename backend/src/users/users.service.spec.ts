import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { User, UserType } from '../entities/user.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { CreateMedicoDto } from './dto/create-medico.dto';

const makePacienteDto = (overrides: Partial<CreatePacienteDto> = {}): CreatePacienteDto => ({
  name: 'João Paciente',
  email: 'joao@email.com',
  password: 'senha123',
  cpf: '123.456.789-00',
  dataNascimento: new Date('1990-05-15'),
  ...overrides,
});

const makeMedicoDto = (overrides: Partial<CreateMedicoDto> = {}): CreateMedicoDto => ({
  name: 'Dra. Ana Médica',
  email: 'ana@email.com',
  password: 'senha123',
  crm: 'CRM/SP 123456',
  especialidade: 'Cardiologia',
  ...overrides,
});

const mockUserRepo = { findOneBy: jest.fn() };
const mockPacienteRepo = { findOneBy: jest.fn() };
const mockMedicoRepo = { findOneBy: jest.fn() };
const mockJwtService = { signAsync: jest.fn().mockResolvedValue('mock-token') };

let mockEntityManager: { create: jest.Mock; save: jest.Mock };
let mockDataSource: { transaction: jest.Mock };

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockEntityManager = {
      create: jest.fn((_Entity: unknown, data: unknown) => data),
      save: jest.fn(),
    };
    mockDataSource = {
      transaction: jest.fn((cb: (em: typeof mockEntityManager) => Promise<unknown>) =>
        cb(mockEntityManager),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Paciente), useValue: mockPacienteRepo },
        { provide: getRepositoryToken(Medico), useValue: mockMedicoRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('createPaciente()', () => {
    it('deve armazenar a senha como hash bcrypt, nunca em texto puro', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockPacienteRepo.findOneBy.mockResolvedValue(null);
      const savedUser = { id: 'uuid-1', email: 'joao@email.com', name: 'João', tipo: UserType.PACIENTE };
      mockEntityManager.save.mockResolvedValueOnce(savedUser);
      mockEntityManager.save.mockResolvedValueOnce({});

      await service.createPaciente(makePacienteDto());

      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      const userCreatedWith = mockEntityManager.create.mock.calls[0][1] as Record<string, unknown>;
      expect(userCreatedWith).toHaveProperty('passwordHash');
      expect(userCreatedWith).not.toHaveProperty('password');
    });

    it('deve retornar PublicUser sem o campo passwordHash', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockPacienteRepo.findOneBy.mockResolvedValue(null);
      const savedUser = { id: 'uuid-1', email: 'joao@email.com', name: 'João', tipo: UserType.PACIENTE };
      mockEntityManager.save.mockResolvedValueOnce(savedUser);
      mockEntityManager.save.mockResolvedValueOnce({});

      const result = await service.createPaciente(makePacienteDto());

      expect(result).toEqual({ id: 'uuid-1', email: 'joao@email.com', name: 'João', tipo: UserType.PACIENTE });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('deve lançar ConflictException se o e-mail já existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ id: 'existing' });
      await expect(service.createPaciente(makePacienteDto())).rejects.toThrow(ConflictException);
    });

    it('deve lançar ConflictException se o CPF já existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockPacienteRepo.findOneBy.mockResolvedValue({ userId: 'other' });
      await expect(service.createPaciente(makePacienteDto())).rejects.toThrow(ConflictException);
    });
  });

  describe('createMedico()', () => {
    it('deve armazenar senha como hash e retornar dados sem passwordHash', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockMedicoRepo.findOneBy.mockResolvedValue(null);
      const savedUser = { id: 'uuid-2', email: 'ana@email.com', name: 'Dra. Ana', tipo: UserType.MEDICO };
      mockEntityManager.save.mockResolvedValueOnce(savedUser);
      mockEntityManager.save.mockResolvedValueOnce({});

      const result = await service.createMedico(makeMedicoDto());

      expect(result).toEqual({ id: 'uuid-2', email: 'ana@email.com', name: 'Dra. Ana', tipo: UserType.MEDICO });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('deve lançar ConflictException se o e-mail já existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ id: 'existing' });
      await expect(service.createMedico(makeMedicoDto())).rejects.toThrow(ConflictException);
    });

    it('deve lançar ConflictException se o CRM já existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockMedicoRepo.findOneBy.mockResolvedValue({ userId: 'other' });
      await expect(service.createMedico(makeMedicoDto())).rejects.toThrow(ConflictException);
    });
  });
});