export interface ListarArquivosResponseDto {
  id: string;
  nomeOriginal: string;
  tipo: string;
  tamanho: number;
  dataUpload: Date;
  descricao: string | null;
  pacienteId: string;
  pacienteNome: string;
  medicoUploadId: string;
  medicoNome: string;
}
