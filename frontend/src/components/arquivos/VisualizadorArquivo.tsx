"use client";

import { useEffect, useState } from "react";
import { getArquivoBlob } from "@/services/arquivos.service";
import DownloadIcon from "@/components/icons/DownloadIcon";
import CloseButton from "@/components/ui/CloseButton";
import type { VisualizadorArquivoProps } from "@/types/visualizador-arquivo";
import { isImagem, isPdf } from "@/utils/tipo-arquivo";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import styles from "./VisualizadorArquivo.module.css";

export default function VisualizadorArquivo({ arquivo, onClose }: VisualizadorArquivoProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [erro, setErro] = useState<string>("");

    useEffect(() => {
        if (!arquivo) {
            setBlobUrl(null);
            setErro("");
            return;
        }

        let cancelado = false;
        let urlCriada: string | null = null;

        (async () => {
            setCarregando(true);
            setErro("");
            try {
                const blob = await getArquivoBlob(arquivo.id);
                if (cancelado) return;
                urlCriada = URL.createObjectURL(blob);
                setBlobUrl(urlCriada);
            } catch (err) {
                if (cancelado) return;
                setErro(mensagemDeErro(err, "Erro ao carregar arquivo."));
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => {
            cancelado = true;
            if (urlCriada) URL.revokeObjectURL(urlCriada);
        };
    }, [arquivo]);

    useEffect(() => {
        if (!arquivo) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [arquivo, onClose]);

    if (!arquivo) return null;

    const renderConteudo = () => {
        if (carregando) return <p className={styles.loading}>Carregando arquivo...</p>;
        if (erro) return <p className={styles.errorMsg} role="alert">{erro}</p>;
        if (!blobUrl) return null;

        if (isImagem(arquivo.tipo)) {
            return <img src={blobUrl} alt={arquivo.nomeOriginal} className={styles.imagem} />;
        }

        if (isPdf(arquivo.tipo)) {
            return (
                <iframe
                    src={blobUrl}
                    title={`Visualização de ${arquivo.nomeOriginal}`}
                    className={styles.pdf}
                />
            );
        }

        return (
            <div className={styles.fallback}>
                <p>Este tipo de arquivo ({arquivo.tipo}) não pode ser pré-visualizado.</p>
                <a
                    href={blobUrl}
                    download={arquivo.nomeOriginal}
                    className={styles.fallbackDownload}
                >
                    Baixar arquivo
                </a>
            </div>
        );
    };

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visualizador-titulo"
        >
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span id="visualizador-titulo" className={styles.nome}>
                            {arquivo.nomeOriginal}
                        </span>
                        {arquivo.descricao && (
                            <span className={styles.descricao}>{arquivo.descricao}</span>
                        )}
                    </div>
                    <div className={styles.actions}>
                        {blobUrl && (
                            <a
                                href={blobUrl}
                                download={arquivo.nomeOriginal}
                                className={styles.iconBtn}
                                aria-label="Baixar arquivo"
                                title="Baixar"
                            >
                                <DownloadIcon />
                            </a>
                        )}
                        <CloseButton
                            onClick={onClose}
                            className={styles.iconBtn}
                            ariaLabel="Fechar visualizador"
                            title="Fechar"
                        />
                    </div>
                </div>
                <div className={styles.body}>{renderConteudo()}</div>
            </div>
        </div>
    );
}
