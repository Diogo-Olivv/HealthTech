"use client";

import { useEffect, useState } from "react";
import { getArquivos } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import PacientsTable from "@/components/arquivos/PacientsTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";

type Status = "loading" | "success" | "error" | "empty";

export default function MedicoArquivosPage() {
    const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
    const [status, setStatus] = useState<Status>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let cancelled = false;
        async function fetchArquivos() {
            setStatus("loading");
            try {
                const data = await getArquivos();
                if (cancelled) return;
                setArquivos(data);
                setStatus(data.length === 0 ? "empty" : "success");
            } catch (err) {
                if (cancelled) return;
                setErrorMsg(
                    err instanceof Error
                        ? err.message
                        : "Erro ao carregar Pacientes.",
                );
                setStatus("error");
            }
        }
        fetchArquivos();
        return () => {
            cancelled = true;
        };
    }, []);

    if (status === "loading") return <LoadingState />;
    // if (status === "error") return <ErrorState msg={errorMsg} />;
    //   if (status === "empty") {
    //     return (
    //       <EmptyState description="Quando Pacientes forem vinculados ao seu perfil, eles aparecerão aqui." title="Nenhum paciente encontrado" />
    //     );
    //   }

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Meus Pacientes</h1>
                        <p className={styles.subtitle}>
                            Pacientes vinculados ao seu perfil
                        </p>
                    </div>
                    <span className={styles.badge} aria-label="Perfil médico">
                        Médico
                    </span>
                </div>

                <div className={`${styles.card} ${styles.fadeIn}`}>
                    <PacientsTable arquivos={arquivos} viewerRole="medico" />
                </div>
            </div>
        </main>
    );
}
