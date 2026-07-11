export type ArquivoDto = {
  id: string;
  nomeOriginal: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
  descricao?: string | null;
  pacienteId: string;
  pacienteNome: string;
  medicoUploadId: string;
  medicoNome: string;
};
