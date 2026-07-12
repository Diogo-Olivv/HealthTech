"use client";

import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import FilesTable from "@/components/arquivos/FilesTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import { useArquivos } from "@/hooks/arquivos/useArquivos";

export default function PacienteArquivosPage() {
    const { data: arquivos, status, error, refetch } = useArquivos();

    if (status === "loading") return <LoadingState />;
    if (status === "error") return <ErrorState msg={error} onRetry={refetch} />;

    const header = (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <h1 className={styles.title}>Meus Arquivos</h1>
                <p className={styles.subtitle}>
                    Seus exames e documentos disponíveis na plataforma
                </p>
            </div>
            <span className={styles.badge} aria-label="Perfil paciente">
                Paciente
            </span>
        </div>
    );

    if (status === "empty") {
        return (
            <main>
                <div className={styles.container}>
                    {header}
                    <EmptyState
                        description="Seus exames e documentos enviados pelo médico aparecerão aqui assim que forem cadastrados."
                        title="Nenhum arquivo disponível"
                    />
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className={styles.container}>
                {header}

                <div className={`${styles.card} ${styles.fadeIn}`}>
                    <FilesTable arquivos={arquivos ?? []} viewerRole="paciente" />
                </div>
            </div>
        </main>
    );
}
