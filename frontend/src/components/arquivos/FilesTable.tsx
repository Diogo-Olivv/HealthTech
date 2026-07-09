"use client";

import { useCallback, useMemo, useState } from "react";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import FileIcon from "@/components/icons/FileIcon";
import DownloadIcon from "@/components/icons/DownloadIcon";
import EditIcon from "@/components/icons/EditIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EditarArquivoModal from "./EditarArquivoModal";
import VisualizadorArquivo from "./VisualizadorArquivo";
import {
    atualizarArquivo,
    deleteArquivo,
    getDownloadUrl,
} from "@/services/arquivos.service";
import { formatDate } from "@/utils/date";
import { formatTamanho } from "@/utils/format-tamanho";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import type { FilesTableProps } from "@/types/files-table";
import styles from "./FilesTable.module.css";

export default function FilesTable({
    arquivos,
    viewerRole,
    medicoLogadoId,
    onMutation,
}: FilesTableProps) {
    const isMedico = viewerRole === "medico";
    const partyHeader = isMedico ? "Paciente" : "Enviado por";
    const ariaLabel = isMedico
        ? "Lista de arquivos do médico"
        : "Lista de arquivos do paciente";

    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState("data_desc");
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [arquivoParaVisualizar, setArquivoParaVisualizar] = useState<ArquivoDto | null>(null);
    const [arquivoParaEditar, setArquivoParaEditar] = useState<ArquivoDto | null>(null);
    const [arquivoParaExcluir, setArquivoParaExcluir] = useState<ArquivoDto | null>(null);
    const [mutating, setMutating] = useState(false);
    const [erro, setErro] = useState("");

    const arquivosFiltrados = useMemo(() => {
        return arquivos
            .filter((arq) => {
                const termo = busca.toLowerCase();
                return (
                    arq.nomeOriginal.toLowerCase().includes(termo) ||
                    (arq.descricao && arq.descricao.toLowerCase().includes(termo)) ||
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

    const podeMutarArquivo = useCallback(
        (arquivo: ArquivoDto): boolean =>
            isMedico && !!medicoLogadoId && arquivo.medicoUploadId === medicoLogadoId,
        [isMedico, medicoLogadoId],
    );

    const handleDownload = async (arquivo: ArquivoDto) => {
        setErro("");
        setDownloadingId(arquivo.id);
        try {
            const { url } = await getDownloadUrl(arquivo.id);
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
            setErro(mensagemDeErro(err, "Erro ao gerar link de download."));
        } finally {
            setDownloadingId(null);
        }
    };

    const handleSalvarEdicao = async (novaDescricao: string | null) => {
        if (!arquivoParaEditar) return;
        setErro("");
        setMutating(true);
        try {
            await atualizarArquivo(arquivoParaEditar.id, {
                descricao: novaDescricao ?? undefined,
            });
            setArquivoParaEditar(null);
            onMutation?.();
        } catch (err) {
            setErro(mensagemDeErro(err, "Erro ao atualizar descrição."));
        } finally {
            setMutating(false);
        }
    };

    const handleConfirmarExclusao = async () => {
        if (!arquivoParaExcluir) return;
        setErro("");
        setMutating(true);
        try {
            await deleteArquivo(arquivoParaExcluir.id);
            setArquivoParaExcluir(null);
            onMutation?.();
        } catch (err) {
            setErro(mensagemDeErro(err, "Erro ao excluir arquivo."));
        } finally {
            setMutating(false);
        }
    };

    return (
        <div>
            {erro && (
                <div className={styles.errorWrapper}>
                    <FeedbackMessage type="error" message={erro} />
                </div>
            )}

            <div className={styles.toolbar}>
                <input
                    type="search"
                    placeholder="Pesquisar por nome, descrição, médico ou paciente..."
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
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arquivosFiltrados.map((arquivo) => {
                            const podeEditar = podeMutarArquivo(arquivo);
                            const baixando = downloadingId === arquivo.id;

                            return (
                                <tr key={arquivo.id} className={styles.rowItem}>
                                    <td>
                                        <span className={styles.cellNome}>
                                            <FileIcon className={styles.fileIcon} />
                                            <span className={styles.cellNomeText}>
                                                <strong>{arquivo.nomeOriginal}</strong>
                                                {arquivo.descricao && (
                                                    <small className={styles.cellDescricao}>
                                                        {arquivo.descricao}
                                                    </small>
                                                )}
                                            </span>
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.tipoBadge}>{arquivo.tipo}</span>
                                    </td>
                                    <td className={styles.cellDate}>
                                        {formatTamanho(arquivo.tamanho)}
                                    </td>
                                    <td className={styles.cellDate}>
                                        {formatDate(arquivo.dataUpload)}
                                    </td>
                                    <td className={styles.cellEnviado}>
                                        {isMedico ? arquivo.pacienteNome : arquivo.medicoNome}
                                    </td>
                                    <td className={styles.cellAcoes}>
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={() => setArquivoParaVisualizar(arquivo)}
                                            aria-label={`Visualizar ${arquivo.nomeOriginal}`}
                                            title="Visualizar"
                                        >
                                            <EyeIcon />
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={() => handleDownload(arquivo)}
                                            disabled={baixando}
                                            aria-label={`Baixar ${arquivo.nomeOriginal}`}
                                            title="Baixar"
                                        >
                                            <DownloadIcon />
                                        </button>
                                        {podeEditar && (
                                            <>
                                                <button
                                                    type="button"
                                                    className={styles.actionBtn}
                                                    onClick={() => setArquivoParaEditar(arquivo)}
                                                    aria-label={`Editar ${arquivo.nomeOriginal}`}
                                                    title="Editar descrição"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                    onClick={() => setArquivoParaExcluir(arquivo)}
                                                    aria-label={`Excluir ${arquivo.nomeOriginal}`}
                                                    title="Excluir"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <VisualizadorArquivo
                arquivo={arquivoParaVisualizar}
                onClose={() => setArquivoParaVisualizar(null)}
            />

            <EditarArquivoModal
                arquivo={arquivoParaEditar}
                isLoading={mutating}
                onClose={() => (mutating ? undefined : setArquivoParaEditar(null))}
                onSubmit={handleSalvarEdicao}
            />

            <ConfirmDialog
                isOpen={!!arquivoParaExcluir}
                title="Excluir arquivo"
                message={`Tem certeza que deseja excluir o arquivo "${arquivoParaExcluir?.nomeOriginal ?? ""}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                isLoading={mutating}
                onConfirm={handleConfirmarExclusao}
                onClose={() => (mutating ? undefined : setArquivoParaExcluir(null))}
            />
        </div>
    );
}
