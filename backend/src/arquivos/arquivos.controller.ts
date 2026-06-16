import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserType } from '../entities/user.entity';
import { ArquivosService } from './arquivos.service';
import { ListarArquivosResponseDto } from './dto/listar-arquivos-response.dto';


type AuthRequest = Request & {
  user: { id: string; tipo: UserType };
};

@Controller('arquivos')
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.PACIENTE, UserType.MEDICO)
  listar(@Req() req: AuthRequest): Promise<ListarArquivosResponseDto[]> {
    const { id, tipo } = req.user;

    if (tipo === UserType.MEDICO) {
      return this.arquivosService.listarParaMedico(id);
    }

    return this.arquivosService.listarParaPaciente(id);
  }
}
