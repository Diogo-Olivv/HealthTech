import type { EspecialidadeResumoDto } from "./medico-vinculado.dto";

export interface SolicitacaoVinculoDto {
  medicoId: string;
  medicoNome: string;
  especialidades: EspecialidadeResumoDto[];
  solicitadoEm: string;
}

export type StatusSolicitacaoEnviada = "PENDENTE" | "REJEITADO";

export interface SolicitacaoEnviadaDto {
  pacienteId: string;
  pacienteNome: string;
  status: StatusSolicitacaoEnviada;
  solicitadoEm: string;
  respondidoEm: string | null;
}
