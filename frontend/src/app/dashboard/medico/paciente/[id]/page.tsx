"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getProntuarioPaciente } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import FilesTable from "@/components/arquivos/FilesTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import Button from "@/components/ui/Button";
import UploadCloudIcon from "@/components/icons/UploadCloudIcon";
import { useAuth } from "@/contexts/AuthContext";
import type { UiStatus } from "@/types/ui-status";

export default function ProntuarioPacientePage() {
    const params = useParams();
    const pacienteId = params.id as string;

    const searchParams = useSearchParams();
    const nomeDoPaciente = searchParams.get("nome") || "Paciente";
    const router = useRouter();
    const { user } = useAuth();

    const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    const carregar = useCallback(
        async (signal?: AbortSignal) => {
            setStatus("loading");
            try {
                const data = await getProntuarioPaciente(pacienteId, signal);
                setArquivos(data);
                setStatus(data.length === 0 ? "empty" : "success");
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setErrorMsg(err instanceof Error ? err.message : "Erro ao carregar o prontuário.");
                setStatus("error");
            }
        },
        [pacienteId],
    );

    useEffect(() => {
        if (!pacienteId) return;
        const controller = new AbortController();
        carregar(controller.signal);
        return () => controller.abort();
    }, [pacienteId, carregar]);

    const renderHeader = () => (
        <>
            <Link
                href="/dashboard/medico"
                className={styles.backLink}
                aria-label="Voltar para o painel clínico"
            >
                Voltar
            </Link>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Prontuário de {nomeDoPaciente}</h1>
                    <p className={styles.subtitle}>
                        Histórico consolidado de exames e laudos
                    </p>
                </div>

                <Button
                    onClick={() => router.push("/dashboard/medico/arquivos/upload")}
                    aria-label={`Enviar novo arquivo para ${nomeDoPaciente}`}
                >
                    <UploadCloudIcon />
                    Novo Upload
                </Button>
            </div>
        </>
    );

    if (status === "loading")
        return (
            <main>
                <div className={styles.container}>
                    {renderHeader()}
                    <LoadingState />
                </div>
            </main>
        );
    if (status === "error")
        return (
            <main>
                <div className={styles.container}>
                    {renderHeader()}
                    <ErrorState msg={errorMsg} onRetry={() => carregar()} />
                </div>
            </main>
        );

    return (
        <main>
            <div className={styles.container}>
                {renderHeader()}

                {status === "empty" ? (
                    <EmptyState
                        title="Nenhum arquivo neste prontuário"
                        description={`${nomeDoPaciente} ainda não tem laudos ou exames registrados. Clique em ‘Novo Upload’ para enviar o primeiro.`}
                    />
                ) : (
                    <div className={`${styles.card} ${styles.fadeIn}`}>
                        <FilesTable
                            arquivos={arquivos}
                            viewerRole="medico"
                            medicoLogadoId={user?.id}
                            onMutation={() => carregar()}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
