"use client";

import { getSentRequests } from "@/services/users.service";
import { useFetchData } from "@/hooks/useFetchData";

export function useSolicitacoesEnviadas() {
    return useFetchData(() => getSentRequests(), [], {
        fallbackErrorMsg: "Erro ao carregar suas solicitações.",
    });
}
