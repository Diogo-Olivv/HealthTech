import type { EspecialidadeDto } from "@/dto/especialidade.dto";

export interface SeletorEspecialidadesProps {
    /** IDs atualmente selecionados. */
    valor: string[];
    onChange: (ids: string[]) => void;
    /** Limite de especialidades (5). */
    max?: number;
    /** Especialidades pré-carregadas (bypass do service --> usado em testes). */
    opcoes?: EspecialidadeDto[];
    id?: string;
}
