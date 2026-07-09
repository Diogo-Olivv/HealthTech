import type { ArquivoDto } from "@/dto/arquivo.dto";
import type { ViewerRole } from "./viewer-role";

export interface FilesTableProps {
    arquivos: ArquivoDto[];
    viewerRole: ViewerRole;
    /** Id do médico logado — habilita edição/exclusão dos próprios uploads. */
    medicoLogadoId?: string;
    /** Callback chamado após operação C/U/D — permite refetch pela página. */
    onMutation?: () => void;
}
