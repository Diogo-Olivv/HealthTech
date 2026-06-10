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
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator'; 
import { UserType } from '../entities/user.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('pacientes')
  @HttpCode(HttpStatus.CREATED)
  createPaciente(@Body() dto: CreatePacienteDto) {
    return this.usersService.createPaciente(dto);
  }

  @Post('medicos')
  @HttpCode(HttpStatus.CREATED)
  createMedico(@Body() dto: CreateMedicoDto) {
    return this.usersService.createMedico(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  // Rota protegida: exige um token válido de um usuário existente
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return req.user;
  }
  @Get('medico/area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.MEDICO)
  areaMedico(@Req() req: Request) {
    return { mensagem: 'Área restrita a médicos', user: req.user };
     }

  @Get('paciente/area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE)
  areaPaciente(@Req() req: Request) {
    return { mensagem: 'Área restrita a pacientes', user: req.user };
  }

}
