"use client";

import { useState } from "react";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import FileIcon from "@/components/icons/FileIcon";
import styles from "./PacientsTable.module.css";

export type ViewerRole = "medico" | "paciente";

interface Props {
    arquivos: ArquivoDto[];
    viewerRole: ViewerRole;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatTamanho(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesTable({ arquivos, viewerRole }: Props) {
    const isMedico = viewerRole === "medico";
    const [searchTerm, setSearchTerm] = useState("");

    const partyHeader = isMedico ? "Paciente" : "Enviado por";
    const ariaLabel = isMedico
        ? "Lista de arquivos do médico"
        : "Lista de arquivos do paciente";

    const filteredArquivos = arquivos.filter(arquivo => {
        const nameMatch = arquivo.nomeOriginal || arquivo.pacienteNome || "";
        return nameMatch.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Pesquisar paciente pelo nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            
            <table className={styles.table} aria-label={ariaLabel}>
                <thead>
                    <tr>
                        <th scope="col">Nome do Paciente</th>
                        <th scope="col">Data de Nascimento</th>
                        <th scope="col">Último Exame Atualizado</th>
                        <th scope="col">Ações</th>
                        {/* <th scope="col">{partyHeader}</th> */}
                    </tr>
                </thead>
                <tbody>
                    {filteredArquivos.map((arquivo) => (
                        <tr key={arquivo.id}>
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
    );
}
