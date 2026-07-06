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
import { AUDIT_METADATA_KEY, AuditConfig } from './audit.decorator';
import { StatusAuditoria } from '../entities/audit-log/audit-log.entity';

interface AuthenticatedRequest extends Request {
  user?: { id?: string };
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const config = this.reflector.getAllAndOverride<AuditConfig>(
      AUDIT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!config) {
      return next.handle();
    }

    const { evento, extractRecursoId } = config;
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const userId = request.user?.id ?? null;

    return next.handle().pipe(
      tap((responseBody) => {
        const recursoId = extractRecursoId?.(responseBody) ?? null;

        this.auditLogService.registrar(
          evento,
          userId,
          recursoId,
          StatusAuditoria.SUCCESS,
          request,
        );
      }),
      catchError((err) => {
        this.auditLogService.registrar(
          evento,
          userId,
          null,
          StatusAuditoria.FAILURE,
          request,
        );
        return throwError(() => err);
      }),
    );
  }
}
