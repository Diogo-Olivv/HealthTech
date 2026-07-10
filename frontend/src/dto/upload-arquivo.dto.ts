export type UploadArquivoDto = {
    file: File;
    pacienteId: string;
    descricao?: string;
};

export const UPLOAD_ARQUIVO_LIMITES = {
    tamanhoMaximoBytes: 10 * 1024 * 1024,
    formatosPermitidos: ["application/pdf", "image/png", "image/jpeg"] as const,
} as const;
