"use client";

import { useEffect, useState } from "react";
import {
    MAX_DESCRICAO_ARQUIVO,
    type EditarArquivoModalProps,
} from "@/types/editar-arquivo-modal";
import styles from "./EditarArquivoModal.module.css";

export default function EditarArquivoModal({
    arquivo,
    isLoading,
    onClose,
    onSubmit,
}: EditarArquivoModalProps) {
    const [descricao, setDescricao] = useState<string>("");

    useEffect(() => {
        setDescricao(arquivo?.descricao ?? "");
    }, [arquivo]);

    useEffect(() => {
        if (!arquivo) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [arquivo, isLoading, onClose]);

    if (!arquivo) return null;

    const trimmedLength = descricao.trim().length;
    const isTooLong = trimmedLength > MAX_DESCRICAO_ARQUIVO;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isTooLong) return;
        const normalizada = descricao.trim();
        await onSubmit(normalizada.length > 0 ? normalizada : null);
    };

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="editar-arquivo-title">
            <form className={styles.dialog} onSubmit={handleSubmit}>
                <h2 id="editar-arquivo-title" className={styles.title}>
                    Editar arquivo
                </h2>
                <p className={styles.hint}>
                    Arquivo: <strong>{arquivo.nomeOriginal}</strong>
                </p>

                <label className={styles.label} htmlFor="descricao-arquivo">
                    Descrição do exame (opcional)
                </label>
                <input
                    id="descricao-arquivo"
                    type="text"
                    className={styles.input}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex.: Hemograma completo"
                    maxLength={MAX_DESCRICAO_ARQUIVO}
                    disabled={isLoading}
                    autoFocus
                />
                <span className={`${styles.counter} ${isTooLong ? styles.counterInvalid : ""}`}>
                    {trimmedLength}/{MAX_DESCRICAO_ARQUIVO}
                </span>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnCancel}`}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`${styles.btn} ${styles.btnConfirm}`}
                        disabled={isLoading || isTooLong}
                    >
                        {isLoading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
