import { SetMetadata } from '@nestjs/common';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';

export const AUDIT_METADATA_KEY = 'audit:config';

export interface AuditConfig {
  evento: TipoEventoAuditoria;
  extractRecursoId?: (response: any, request: any) => string | null;
}

export type AuditDecoratorInput = TipoEventoAuditoria | AuditConfig;

const normalize = (input: AuditDecoratorInput): AuditConfig =>
  typeof input === 'string' ? { evento: input } : input;

export const Audit = (input: AuditDecoratorInput) =>
  SetMetadata(AUDIT_METADATA_KEY, normalize(input));