"use client";

import { getMyMedicos } from "@/services/users.service";
import { useFetchData } from "@/hooks/useFetchData";
import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";

export function useMeusMedicos(initialData?: MedicoVinculadoDto[]) {
    return useFetchData<MedicoVinculadoDto[]>(() => getMyMedicos(), [], {
        fallbackErrorMsg: "Erro ao carregar seus médicos.",
        initialData: initialData ?? null,
    });
}
