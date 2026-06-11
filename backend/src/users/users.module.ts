import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';    
import { User } from '../entities/user.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/roles.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Paciente, Medico]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret-change-me'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as StringValue,
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy , Reflector, RolesGuard],
  exports: [UsersService, RolesGuard],
})
export class UsersModule {}
