import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import type { Request } from 'express';
import {
  AuditLog,
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../entities/audit-log/audit-log.entity';
import { User } from '../entities/user.entity';

export interface AuditLogFiltros {
  userId?: string;
  usuario?: string;
  tipoEvento?: TipoEventoAuditoria;
  dataInicio?: string;
  dataFim?: string;
}

export interface AuditLogPaginacao {
  page?: number;
  limit?: number;
}

export interface AuditLogListagem {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

const PAGE_PADRAO = 1;
const LIMIT_PADRAO = 50;
const LIMIT_MAXIMO = 200;

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async listar(
    filtros: AuditLogFiltros,
    paginacao: AuditLogPaginacao,
  ): Promise<AuditLogListagem> {
    const page =
      paginacao.page && paginacao.page > 0 ? paginacao.page : PAGE_PADRAO;
    const limit = Math.min(
      paginacao.limit && paginacao.limit > 0 ? paginacao.limit : LIMIT_PADRAO,
      LIMIT_MAXIMO,
    );

    const where: FindOptionsWhere<AuditLog> = {};
    if (filtros.userId) where.userId = filtros.userId;
    if (filtros.tipoEvento) where.tipoEvento = filtros.tipoEvento;

    if (filtros.usuario) {
      const termo = `%${filtros.usuario}%`;
      const usuarios = await this.userRepo.find({
        select: ['id'],
        where: [
          { email: Raw((alias) => `${alias} ILIKE :termo`, { termo }) },
          { name: Raw((alias) => `${alias} ILIKE :termo`, { termo }) },
        ],
        take: 500,
      });

      if (usuarios.length === 0) {
        return { items: [], total: 0, page, limit };
      }
      where.userId = In(usuarios.map((u) => u.id));
    }

    if (filtros.dataInicio && filtros.dataFim) {
      where.timestamp = Between(
        new Date(filtros.dataInicio),
        new Date(filtros.dataFim),
      );
    } else if (filtros.dataInicio) {
      where.timestamp = MoreThanOrEqual(new Date(filtros.dataInicio));
    } else if (filtros.dataFim) {
      where.timestamp = LessThanOrEqual(new Date(filtros.dataFim));
    }

    const [items, total] = await this.auditRepo.findAndCount({
      where,
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async registrar(
    evento: TipoEventoAuditoria,
    userId: string | null,
    recursoId: string | null,
    status: StatusAuditoria,
    request: Request,
  ): Promise<void> {
    const ipOrigem = request.ip ?? 'unknown';
    const userAgent = request.headers['user-agent'] ?? null;

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
