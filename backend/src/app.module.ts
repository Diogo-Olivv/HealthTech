import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Paciente } from './entities/paciente.entity';
import { Medico } from './entities/medico.entity';
import { Arquivo } from './entities/arquivo.entity';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { ArquivosModule } from './arquivos/arquivos.module';
import { MedicoPaciente } from './entities/medico-paciente.entity';
import { AuditLog } from './entities/audit-log/audit-log.entity';
import { MedicoPacienteModule } from './medico-paciente/medico-paciente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        const instanceName = config.get<string>('INSTANCE_CONNECTION_NAME');

        return {
          type: 'postgres',
          ...(instanceName
            ? { host: `/cloudsql/${instanceName}` }
            : {
                host: config.get('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
              }),
          username: config.get('DB_USER', 'postgres'),
          password: config.get('DB_PASSWORD', 'postgres'),
          database: config.get('DB_NAME', 'healthtech'),
          entities: [User, Paciente, Medico, MedicoPaciente, Arquivo, AuditLog],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsTableName: 'migrations',
          synchronize: false,
          migrationsRun: config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') !== 'production',
        };
      },
    }),
    UsersModule,
    HealthModule,
    ArquivosModule,
    MedicoPacienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
