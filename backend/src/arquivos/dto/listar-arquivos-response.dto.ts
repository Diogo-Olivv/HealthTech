export interface ListarArquivosResponseDto {
  id: string;
  nomeOriginal: string;
  tipo: string;
  tamanho: number;
  dataUpload: Date;
  pacienteId: string;
  pacienteNome: string;
  medicoUploadId: string;
  medicoNome: string;
}
