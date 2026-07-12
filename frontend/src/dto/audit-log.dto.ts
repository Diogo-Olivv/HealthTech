// Espelha os enums do backend em backend/src/entities/audit-log/audit-log.entity.ts
export enum TipoEventoAuditoria {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  CRIACAO_USUARIO = "CRIACAO_USUARIO",
  ATUALIZACAO_USUARIO = "ATUALIZACAO_USUARIO",
  EXCLUSAO_USUARIO = "EXCLUSAO_USUARIO",
  UPLOAD_ARQUIVO = "UPLOAD_ARQUIVO",
  DOWNLOAD_ARQUIVO = "DOWNLOAD_ARQUIVO",
  VISUALIZACAO_ARQUIVO = "VISUALIZACAO_ARQUIVO",
  EXCLUSAO_ARQUIVO = "EXCLUSAO_ARQUIVO",
  VINCULO_MEDICO_PACIENTE = "VINCULO_MEDICO_PACIENTE",
  DESVINCULO_MEDICO_PACIENTE = "DESVINCULO_MEDICO_PACIENTE",
  SOLICITACAO_VINCULO = "SOLICITACAO_VINCULO",
  APROVACAO_VINCULO = "APROVACAO_VINCULO",
  REJEICAO_VINCULO = "REJEICAO_VINCULO",
  REVOGACAO_VINCULO = "REVOGACAO_VINCULO",
  ACESSO_NEGADO = "ACESSO_NEGADO",
  TENTATIVA_ESCALONAMENTO_PRIVILEGIO = "TENTATIVA_ESCALONAMENTO_PRIVILEGIO",
}

export enum StatusAuditoria {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export interface AuditLogDto {
  id: string;
  userId: string | null;
  tipoEvento: TipoEventoAuditoria;
  recursoId: string | null;
  status: StatusAuditoria;
  ipOrigem: string;
  userAgent: string | null;
  timestamp: string;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  userId?: string;
  tipoEvento?: TipoEventoAuditoria;
  dataInicio?: string;
  dataFim?: string;
}

export interface AuditLogListagemDto {
  items: AuditLogDto[];
  total: number;
  page: number;
  limit: number;
}
