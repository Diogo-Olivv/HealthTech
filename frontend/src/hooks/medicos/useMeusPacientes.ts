"use client";

import { getMyPatients } from "@/services/users.service";
import { useFetchData } from "@/hooks/useFetchData";

export function useMeusPacientes() {
    return useFetchData(() => getMyPatients(), [], {
        fallbackErrorMsg: "Erro ao carregar seus pacientes.",
    });
}
