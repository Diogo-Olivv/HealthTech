import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Audit } from '../audit/audit.decorator';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';
import { UserType } from '../entities/user.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  LoginResponseDto,
  PublicUser,
  PublicUserDto,
} from './dto/public-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('pacientes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar novo paciente',
    description: 'Cria um usuário do tipo PACIENTE.',
  })
  @ApiBody({ type: CreatePacienteDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Paciente criado com sucesso.',
    type: PublicUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos (validação class-validator).',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Já existe usuário com o e-mail/CPF informado.',
  })
  @Audit({
    evento: TipoEventoAuditoria.CRIACAO_USUARIO,
    extractRecursoId: (r: PublicUser) => r.id,
  })
  createPaciente(@Body() dto: CreatePacienteDto) {
    return this.usersService.createPaciente(dto);
  }

  @Post('medicos')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar novo médico',
    description: 'Cria um usuário do tipo MEDICO e o associa a suas especialidades.',
  })
  @ApiBody({ type: CreateMedicoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Médico criado com sucesso.',
    type: PublicUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou especialidades inexistentes.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Já existe usuário com o e-mail/CRM informado.',
  })
  @Audit({
    evento: TipoEventoAuditoria.CRIACAO_USUARIO,
    extractRecursoId: (r: PublicUser) => r.id,
  })
  createMedico(@Body() dto: CreateMedicoDto) {
    return this.usersService.createMedico(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Retorna um accessToken (JWT) e os dados públicos do usuário.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login efetuado com sucesso.',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  @Audit({
    evento: TipoEventoAuditoria.LOGIN,
    extractRecursoId: (r: { user: PublicUser }) => r.user.id,
  })
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiResponse({ status: HttpStatus.OK, type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  me(@Req() req: Request) {
    return req.user;
  }

  @Get('medico/area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Área restrita a médicos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Acesso concedido.' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Usuário não possui a role MEDICO.' })
  areaMedico(@Req() req: Request) {
    return { mensagem: 'Área restrita a médicos', user: req.user };
  }

  @Get('paciente/area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Área restrita a pacientes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Acesso concedido.' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Usuário não possui a role PACIENTE.' })
  areaPaciente(@Req() req: Request) {
    return { mensagem: 'Área restrita a pacientes', user: req.user };
  }
}
