import type { EspecialidadeDto } from "@/dto/especialidade.dto";
import { API_URL } from "@/lib/api-config";
import { throwFromResponse } from "@/lib/http";

let cache: EspecialidadeDto[] | null = null;

export async function listarEspecialidades(): Promise<EspecialidadeDto[]> {
    if (cache) return cache;

    const res = await fetch(`${API_URL}/especialidades`);
    if (!res.ok) await throwFromResponse(res, "Erro ao carregar especialidades.");

    cache = await res.json();
    return cache!;
}

/** Somente para testes — reseta o cache em memória. */
export function _resetEspecialidadesCache(): void {
    cache = null;
}
