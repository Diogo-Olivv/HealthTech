import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../entities/user.entity';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { AuditLogService } from './audit-log.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  listar(@Query() query: AuditLogQueryDto) {
    return this.auditLogService.listar(
      {
        userId: query.userId,
        usuario: query.usuario,
        tipoEvento: query.tipoEvento,
        dataInicio: query.dataInicio,
        dataFim: query.dataFim,
      },
      { page: query.page, limit: query.limit },
    );
  }
}
