import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
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
    return this.medicoPacienteService.desvincular(
      req.user.id,
      dto.pacienteId,
      req,
    );
  }

  @Get('meus-pacientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  meusPacientes(@Req() req: AuthRequest) {
    return this.medicoPacienteService.meusPacientes(req.user.id);
  }

  @Get('pacientes-disponiveis')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  pacientesDisponiveis(@Req() req: AuthRequest) {
    return this.medicoPacienteService.pacientesDisponiveis(req.user.id);
  }

  @Get('solicitacoes-enviadas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  solicitacoesEnviadas(@Req() req: AuthRequest) {
    return this.medicoPacienteService.solicitacoesEnviadasPorMedico(req.user.id);
  }

  @Get('meus-medicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  meusMedicos(@Req() req: AuthRequest) {
    return this.medicoPacienteService.meusMedicos(req.user.id);
  }

  @Get('solicitacoes-pendentes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  solicitacoesPendentes(@Req() req: AuthRequest) {
    return this.medicoPacienteService.solicitacoesPendentesParaPaciente(
      req.user.id,
    );
  }

  @Post('solicitacoes/:medicoId/aprovar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  aprovar(
    @Req() req: AuthRequest,
    @Param('medicoId', new ParseUUIDPipe()) medicoId: string,
  ) {
    return this.medicoPacienteService.aprovarSolicitacao(
      req.user.id,
      medicoId,
      req,
    );
  }

  @Post('solicitacoes/:medicoId/rejeitar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  rejeitar(
    @Req() req: AuthRequest,
    @Param('medicoId', new ParseUUIDPipe()) medicoId: string,
  ) {
    return this.medicoPacienteService.rejeitarSolicitacao(
      req.user.id,
      medicoId,
      req,
    );
  }

  @Delete('vinculos/:medicoId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  revogar(
    @Req() req: AuthRequest,
    @Param('medicoId', new ParseUUIDPipe()) medicoId: string,
  ) {
    return this.medicoPacienteService.revogarAcesso(req.user.id, medicoId, req);
  }
}
