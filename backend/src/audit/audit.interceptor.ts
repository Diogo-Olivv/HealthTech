import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import type { Request } from 'express';
import { AuditLogService } from './audit-log.service';
import { AuditConfig } from './audit.decorator';
import {
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../entities/audit-log/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const config = this.reflector.get<TipoEventoAuditoria | AuditConfig>(
      'audit:config',
      context.getHandler(),
    );

    if (!config) {
      return next.handle();
    }

    const { onSuccess, onFailure } = this.resolveConfig(config);
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request as any).user?.id ?? null;

    return next.handle().pipe(
      tap((responseBody) => {
        const recursoId = this.extractRecursoId(responseBody);

        this.auditLogService.registrar(
          onSuccess,
          userId,
          recursoId,
          StatusAuditoria.SUCCESS,
          request,
        );
      }),
      catchError((err) => {
        this.auditLogService.registrar(
          onFailure ?? onSuccess,
          userId,
          null,
          StatusAuditoria.FAILURE,
          request,
        );
        return throwError(() => err);
      }),
    );
  }

  private resolveConfig(config: TipoEventoAuditoria | AuditConfig): {
    onSuccess: TipoEventoAuditoria;
    onFailure?: TipoEventoAuditoria;
  } {
    if (typeof config === 'string') {
      return { onSuccess: config };
    }
    return { onSuccess: config.onSuccess, onFailure: config.onFailure };
  }

  private extractRecursoId(responseBody: any): string | null {
    if (!responseBody || typeof responseBody !== 'object') return null;
    return (
      responseBody.id ??
      responseBody.user?.id ??
      responseBody.userId ??
      responseBody.pacienteId ??
      responseBody.medicoId ??
      null
    );
  }
}
