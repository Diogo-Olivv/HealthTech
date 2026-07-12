jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { seedAdmin } from './admin.seed';
import { UserType } from '../../entities/user.entity';

describe('seedAdmin()', () => {
  const mockUsersRepository = {
    findOneBy: jest.fn(),
    create: jest.fn((data: unknown) => data),
    save: jest.fn(),
  };

  const mockDataSource = {
    getRepository: jest.fn().mockReturnValue(mockUsersRepository),
  } as unknown as DataSource;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsersRepository.create.mockImplementation((data: unknown) => data);
  });

  it('deve gerar hash bcrypt da senha e criar o usuário com tipo ADMIN', async () => {
    mockUsersRepository.findOneBy.mockResolvedValue(null);
    mockUsersRepository.save.mockImplementation((data: unknown) => data);

    const result = await seedAdmin(mockDataSource, 'admin@healthtech.dev', 'senha-forte');

    expect(bcrypt.hash).toHaveBeenCalledWith('senha-forte', 10);
    expect(mockUsersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@healthtech.dev',
        passwordHash: 'hashed-password',
        tipo: UserType.ADMIN,
      }),
    );
    expect(result.created).toBe(true);
  });

  it('nunca deve armazenar a senha em texto puro', async () => {
    mockUsersRepository.findOneBy.mockResolvedValue(null);
    mockUsersRepository.save.mockImplementation((data: unknown) => data);

    await seedAdmin(mockDataSource, 'admin@healthtech.dev', 'senha-forte');

    const createdWith = mockUsersRepository.create.mock.calls[0][0] as Record<string, unknown>;
    expect(createdWith).not.toHaveProperty('password');
    expect(createdWith.passwordHash).toBe('hashed-password');
  });

  it('não deve criar um novo usuário se o e-mail já existir', async () => {
    const existing = { id: 'existing-id', email: 'admin@healthtech.dev', tipo: UserType.ADMIN };
    mockUsersRepository.findOneBy.mockResolvedValue(existing);

    const result = await seedAdmin(mockDataSource, 'admin@healthtech.dev', 'senha-forte');

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUsersRepository.save).not.toHaveBeenCalled();
    expect(result).toEqual({ created: false, user: existing });
  });
});
