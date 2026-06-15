import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { RolesGuard } from '../auth/roles.guard';
import { MedicoPacienteController } from './medico-paciente.controller';
import { MedicoPacienteService } from './medico-paciente.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicoPaciente, Medico, Paciente]),
    PassportModule,
  ],
  controllers: [MedicoPacienteController],
  providers: [MedicoPacienteService, Reflector, RolesGuard],
})
export class MedicoPacienteModule {}
