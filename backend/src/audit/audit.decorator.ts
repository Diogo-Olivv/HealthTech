import { SetMetadata } from '@nestjs/common';
import type { Request } from 'express';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';

export const AUDIT_METADATA_KEY = 'audit:config';

export interface AuditConfig {
  readonly evento: TipoEventoAuditoria;
  readonly extractRecursoId?: (response: unknown, request: Request) => string | null;
}

export type AuditDecoratorInput = TipoEventoAuditoria | AuditConfig;

const toAuditConfig = (input: AuditDecoratorInput): AuditConfig =>
  typeof input === 'string' ? { evento: input } : input;

export const Audit = (input: AuditDecoratorInput) =>
  SetMetadata(AUDIT_METADATA_KEY, toAuditConfig(input));