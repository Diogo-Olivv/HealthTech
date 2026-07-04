import { SetMetadata } from '@nestjs/common';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';

export interface AuditConfig {
  onSuccess: TipoEventoAuditoria;
  onFailure?: TipoEventoAuditoria;
}

export const Audit = (config: TipoEventoAuditoria | AuditConfig) => 
  SetMetadata('audit:config', config);