import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto";

export interface MedicosTableProps {
    medicos: MedicoVinculadoDto[];
}

export interface PatientsTableProps {
    pacientes: PacienteVinculadoDto[];
}
