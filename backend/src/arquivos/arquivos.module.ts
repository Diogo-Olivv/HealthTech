import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Arquivo } from '../entities/arquivo.entity';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { RolesGuard } from '../auth/roles.guard';
import { ArquivosController } from './arquivos.controller';
import { ArquivosService } from './arquivos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Arquivo, MedicoPaciente]),
    PassportModule,
  ],
  controllers: [ArquivosController],
  providers: [ArquivosService, Reflector, RolesGuard],
  exports: [ArquivosService],
})
export class ArquivosModule {}
