import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

loadEnv();
import { Paciente } from './entities/paciente.entity';
import { Medico } from './entities/medico.entity';
import { MedicoPaciente } from './entities/medico-paciente.entity';
import { Arquivo } from './entities/arquivo.entity';

const instanceName = process.env.INSTANCE_CONNECTION_NAME;

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(instanceName
    ? { host: `/cloudsql/${instanceName}` }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
      }),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'healthtech',
  entities: [User, Paciente, Medico, MedicoPaciente, Arquivo],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
