"use client";

import { getPendingRequests } from "@/services/users.service";
import { useFetchData } from "@/hooks/useFetchData";

export function usePendingRequests() {
    return useFetchData(() => getPendingRequests(), [], {
        fallbackErrorMsg: "Erro ao carregar suas solicitações.",
    });
}
