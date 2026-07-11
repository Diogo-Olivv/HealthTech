export interface EspecialidadeResumoDto {
  id: string;
  nome: string;
}

export interface MedicoVinculadoDto {
  medicoId: string;
  nome: string;
  /** Especialidades Concatenadas -- Versão Antiga. */
  especialidade: string;
  especialidades: EspecialidadeResumoDto[];
  vinculadoEm: string;
}
