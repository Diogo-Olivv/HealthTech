import type { ArquivoDto } from "@/dto/arquivo.dto";
import FileIcon from "@/components/icons/FileIcon";
import styles from "./FilesTable.module.css";
import { formatDate } from "@/utils/date";
import { useState, useMemo } from "react";

export type ViewerRole = "medico" | "paciente";

interface Props {
    arquivos: ArquivoDto[];
    viewerRole: ViewerRole;
}

function formatTamanho(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesTable({ arquivos, viewerRole }: Props) {
    const isMedico = viewerRole === "medico";
    const partyHeader = isMedico ? "Paciente" : "Enviado por";
    const ariaLabel = isMedico
        ? "Lista de arquivos do médico"
        : "Lista de arquivos do paciente";

    // --- NOVA LÓGICA DE FILTRO E ORDENAÇÃO ---
    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState("data_desc");

    const arquivosFiltrados = useMemo(() => {
        return arquivos
            .filter((arq) => {
                const termo = busca.toLowerCase();
                return (
                    arq.nomeOriginal.toLowerCase().includes(termo) ||
                    (arq.medicoNome && arq.medicoNome.toLowerCase().includes(termo)) ||
                    (arq.pacienteNome && arq.pacienteNome.toLowerCase().includes(termo))
                );
            })
            .sort((a, b) => {
                if (ordenacao === "data_desc") return new Date(b.dataUpload).getTime() - new Date(a.dataUpload).getTime();
                if (ordenacao === "data_asc") return new Date(a.dataUpload).getTime() - new Date(b.dataUpload).getTime();
                if (ordenacao === "nome_asc") return a.nomeOriginal.localeCompare(b.nomeOriginal);
                if (ordenacao === "nome_desc") return b.nomeOriginal.localeCompare(a.nomeOriginal);
                if (ordenacao === "tamanho_asc") return a.tamanho - b.tamanho;
                if (ordenacao === "tamanho_desc") return b.tamanho - a.tamanho;
                return 0;
            });
    }, [arquivos, busca, ordenacao]);

    return (
        <div>
            {/* Toolbar de Ações */}
            <div className={styles.toolbar}>
                <input 
                    type="search" 
                    placeholder="Pesquisar por nome do arquivo, médico ou paciente..." 
                    className={styles.searchInput}
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    aria-label="Pesquisar arquivos"
                />
                <select 
                    className={styles.sortSelect} 
                    value={ordenacao} 
                    onChange={(e) => setOrdenacao(e.target.value)}
                    aria-label="Ordenar arquivos"
                >
                    <option value="data_desc">Mais recentes</option>
                    <option value="data_asc">Mais antigos</option>
                    <option value="nome_asc">Nome (A - Z)</option>
                    <option value="nome_desc">Nome (Z - A)</option>
                    <option value="tamanho_asc">Menor Tamanho</option>
                    <option value="tamanho_desc">Maior Tamanho</option>
                </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table} aria-label={ariaLabel}>
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Tamanho</th>
                            <th scope="col">Data de upload</th>
                            <th scope="col">{partyHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arquivosFiltrados.map((arquivo) => (
                            <tr key={arquivo.id} tabIndex={0} className={styles.rowItem}>
                                <td>
                                    <span className={styles.cellNome}>
                                        <FileIcon className={styles.fileIcon} />
                                        {arquivo.nomeOriginal}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.tipoBadge}>
                                        {arquivo.tipo}
                                    </span>
                                </td>
                                <td className={styles.cellDate}>
                                    {formatTamanho(arquivo.tamanho)}
                                </td>
                                <td className={styles.cellDate}>
                                    {formatDate(arquivo.dataUpload)}
                                </td>
                                <td className={styles.cellEnviado}>
                                    {isMedico
                                        ? arquivo.pacienteNome
                                        : arquivo.medicoNome}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
