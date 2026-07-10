"use client";

import { useEffect } from "react";
import type { ConfirmDialogProps } from "@/types/confirm-dialog";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    isLoading = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
            <div className={styles.dialog}>
                <h2 id="confirm-dialog-title" className={styles.title}>
                    {title}
                </h2>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnCancel}`}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnConfirm}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
