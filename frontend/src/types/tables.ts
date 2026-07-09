import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto";

export interface MedicosTableProps {
    medicos: MedicoVinculadoDto[];
    onRevogar?: (medicoId: string, medicoNome: string) => void | Promise<void>;
    revogandoId?: string | null;
}

export interface PatientsTableProps {
    pacientes: PacienteVinculadoDto[];
}
