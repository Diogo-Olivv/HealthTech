import type { ArquivoDto } from "@/dto/arquivo.dto";

export const MAX_DESCRICAO_ARQUIVO = 200;

export interface EditarArquivoModalProps {
    arquivo: ArquivoDto | null;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (descricao: string | null) => Promise<void> | void;
}
