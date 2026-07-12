"use client";

import { getArquivos } from "@/services/arquivos.service";
import { useFetchData } from "@/hooks/useFetchData";

export function useArquivos() {
    return useFetchData(() => getArquivos(), [], {
        fallbackErrorMsg: "Erro ao carregar os arquivos.",
    });
}
