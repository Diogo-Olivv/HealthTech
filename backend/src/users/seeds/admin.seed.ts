import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User, UserType } from '../../entities/user.entity';
import { AppDataSource } from '../../data-source';

loadEnv();

export interface AdminSeedResult {
  created: boolean;
  user: User;
}

export async function seedAdmin(
  dataSource: DataSource,
  email: string,
  password: string,
): Promise<AdminSeedResult> {
  const usersRepository = dataSource.getRepository(User);

  const existing = await usersRepository.findOneBy({ email });
  if (existing) {
    return { created: false, user: existing };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = usersRepository.create({
    name: 'Administrador',
    email,
    passwordHash,
    tipo: UserType.ADMIN,
  });

  const user = await usersRepository.save(admin);
  return { created: true, user };
}

async function run(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias (variáveis de ambiente) para rodar este seed.',
    );
    process.exitCode = 1;
    return;
  }

  if (process.env.NODE_ENV === 'production' && process.env.ADMIN_SEED_ALLOW_PROD !== 'true') {
    console.error(
      'Seed de admin bloqueado em produção. Só rode com aprovação explícita, definindo ADMIN_SEED_ALLOW_PROD=true.',
    );
    process.exitCode = 1;
    return;
  }

  const dataSource = await AppDataSource.initialize();

  try {
    const result = await seedAdmin(dataSource, email, password);
    if (result.created) {
      console.log(`Admin criado com sucesso: ${email}`);
    } else {
      console.log(`Usuário com e-mail ${email} já existe — nenhuma alteração feita.`);
    }
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Falha ao rodar o seed de admin:', err);
    process.exitCode = 1;
  });
}
