import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Audit } from '../audit/audit.decorator';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';
import { UserType } from '../entities/user.entity';
import { MedicoPacienteDto } from './dto/medico-paciente.dto';
import { MedicoPacienteService } from './medico-paciente.service';
import type { AuthRequest } from '../auth/models/AuthRequest';

@Controller('medico-paciente')
export class MedicoPacienteController {
  constructor(private readonly medicoPacienteService: MedicoPacienteService) {}

  @Post('vincular')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  @Audit({
    evento: TipoEventoAuditoria.VINCULO_MEDICO_PACIENTE,
    extractRecursoId: (_res, req) => req.body.pacienteId,
  })
  vincular(@Req() req: AuthRequest, @Body() dto: MedicoPacienteDto) {
    return this.medicoPacienteService.vincular(req.user.id, dto.pacienteId);
  }

  @Delete('desvincular')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  @Audit({
    evento: TipoEventoAuditoria.DESVINCULO_MEDICO_PACIENTE,
    extractRecursoId: (_res, req) => req.body.pacienteId,
  })
  desvincular(@Req() req: AuthRequest, @Body() dto: MedicoPacienteDto) {
    return this.medicoPacienteService.desvincular(req.user.id, dto.pacienteId);
  }

  @Get('meus-pacientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  meusPacientes(@Req() req: AuthRequest) {
    return this.medicoPacienteService.meusPacientes(req.user.id);
  }

  @Get('meus-medicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  meusMedicos(@Req() req: AuthRequest) {
    return this.medicoPacienteService.meusMedicos(req.user.id);
  }
}
