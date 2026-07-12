"use client";

import { useFetchData } from "@/hooks/useFetchData";
import { getAuditLogs } from "@/services/audit.service";
import type { AuditLogListagemDto, AuditLogQuery } from "@/dto/audit-log.dto";

export function useAuditLogs(params: AuditLogQuery) {
    const { page, limit, userId, usuario, tipoEvento, dataInicio, dataFim } = params;

    return useFetchData<AuditLogListagemDto>(
        (signal) => getAuditLogs(params, signal),
        [page, limit, userId, usuario, tipoEvento, dataInicio, dataFim],
        {
            fallbackErrorMsg: "Erro ao carregar logs de auditoria.",
            treatEmptyArrayAsEmpty: false,
        },
    );
}
