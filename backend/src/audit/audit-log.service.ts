import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import {
  AuditLog,
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../entities/audit-log/audit-log.entity';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async registrar(
    evento: TipoEventoAuditoria,
    userId: string | null,
    recursoId: string | null,
    status: StatusAuditoria,
    request: Request,
  ): Promise<void> {
    const ipOrigem = request.ip ?? 'unknown';
    const userAgent =
      (request.headers['user-agent'] as string | undefined) ?? null;

    const mensagem = `[AuditLog] ${evento} | userId=${userId ?? 'null'} | recursoId=${recursoId ?? 'null'} | status=${status} | ip=${ipOrigem}`;

    if (status === StatusAuditoria.SUCCESS) {
      this.logger.log(mensagem);
    } else {
      this.logger.warn(mensagem);
    }

    try {
      const log = this.auditRepo.create({
        userId,
        tipoEvento: evento,
        recursoId,
        status,
        ipOrigem,
        userAgent,
      });
      await this.auditRepo.save(log);
    } catch (err) {
      this.logger.error(
        `[AuditLog] Falha ao persistir evento ${evento}: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }
}
