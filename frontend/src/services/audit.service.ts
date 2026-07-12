import type { AuditLogListagemDto, AuditLogQuery } from "@/dto/audit-log.dto";
import { API_URL } from "@/lib/api-config";
import { authHeaders, throwFromResponse } from "@/lib/http";

function buildQuery(params: AuditLogQuery): string {
  const qp = new URLSearchParams();
  if (params.page) qp.append("page", String(params.page));
  if (params.limit) qp.append("limit", String(params.limit));
  if (params.userId) qp.append("userId", params.userId);
  if (params.tipoEvento) qp.append("tipoEvento", params.tipoEvento);
  if (params.dataInicio) qp.append("dataInicio", params.dataInicio);
  if (params.dataFim) qp.append("dataFim", params.dataFim);
  const str = qp.toString();
  return str ? `?${str}` : "";
}

export async function getAuditLogs(
  params: AuditLogQuery,
  signal?: AbortSignal,
): Promise<AuditLogListagemDto> {
  const res = await fetch(`${API_URL}/audit/logs${buildQuery(params)}`, {
    method: "GET",
    headers: authHeaders(),
    signal,
  });
  if (!res.ok) await throwFromResponse(res, "Erro ao buscar logs de auditoria.");
  return res.json();
}
