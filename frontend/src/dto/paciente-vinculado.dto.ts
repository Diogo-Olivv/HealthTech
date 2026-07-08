export interface PacienteVinculadoDto {
    id: string; // ID do vínculo ou do paciente
    pacienteId: string;
    nome: string;
    cpf: string;
    email: string;
    dataNascimento?: string;
    vinculadoEm: string;
}
