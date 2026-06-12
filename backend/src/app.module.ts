import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Paciente } from './entities/paciente.entity';
import { Medico } from './entities/medico.entity';
import { MedicoPaciente } from './entities/medico-paciente.entity';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { MedicoPacienteModule } from './medico-paciente/medico-paciente.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const instanceName = config.get<string>('INSTANCE_CONNECTION_NAME');

        return {
          type: 'postgres',
          // Cloud Run injeta o socket automaticamente; dev usa TCP (Docker Compose)
          ...(instanceName
            ? { host: `/cloudsql/${instanceName}` }
            : { host: config.get('DB_HOST', 'localhost'), port: config.get<number>('DB_PORT', 5432) }),
          username: config.get('DB_USER', 'postgres'),
          password: config.get('DB_PASSWORD', 'postgres'),
          database: config.get('DB_NAME', 'healthtech'),
          entities: [User, Paciente, Medico, MedicoPaciente],
          synchronize: config.get('NODE_ENV') !== 'production' || config.get('DB_SYNC') === 'true',
          logging: config.get('NODE_ENV') !== 'production',
        };
      },
    }),
    UsersModule,
    HealthModule,
    MedicoPacienteModule,
  ],
})
export class AppModule {}
