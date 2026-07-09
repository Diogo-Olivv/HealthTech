import type { ArquivoDto } from "@/dto/arquivo.dto";

export interface VisualizadorArquivoProps {
    arquivo: ArquivoDto | null;
    onClose: () => void;
}
