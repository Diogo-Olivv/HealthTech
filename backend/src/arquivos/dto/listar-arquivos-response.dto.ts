
export interface ListarArquivosResponseDto {
  id: string;
  nomeOriginal: string;
  tipo: string;
  tamanho: number;
  dataUpload: Date;
  pacienteId: string;
  medicoUploadId: string;
}
