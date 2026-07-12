"use client";

import { getProntuarioPaciente } from "@/services/arquivos.service";
import { useFetchData } from "@/hooks/useFetchData";

export function useProntuarioPaciente(pacienteId: string | undefined) {
    return useFetchData(
        (signal) => getProntuarioPaciente(pacienteId!, signal),
        [pacienteId],
        {
            enabled: !!pacienteId,
            fallbackErrorMsg: "Erro ao carregar o prontuário.",
        },
    );
}
