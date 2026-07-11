"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getArquivos } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import FilesTable from "@/components/arquivos/FilesTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import Button from "@/components/ui/Button";
import type { UiStatus } from "@/types/ui-status";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import UploadCloudIcon from "@/components/icons/UploadCloudIcon";
import { useAuth } from "@/contexts/AuthContext";


export default function ArquivosMedicoPage() {
    const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    const carregar = useCallback(async () => {
        setStatus("loading");
        try {
            const dados = await getArquivos();
            setArquivos(dados);
            setStatus(dados.length === 0 ? "empty" : "success");
        } catch (err) {
            setErrorMsg(mensagemDeErro(err, "Erro ao carregar os arquivos."));
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    if (status === "loading") return <LoadingState />;
    if (status === "error")
        return <ErrorState msg={errorMsg} onRetry={carregar} />;

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Meus Arquivos</h1>
                        <p className={styles.subtitle}>
                            Histórico de laudos e exames enviados por você
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push("/dashboard/medico/arquivos/upload")}
                        aria-label="Ir para tela de upload de novo arquivo"
                    >
                        <UploadCloudIcon />
                        Novo Upload
                    </Button>
                </div>

                {status === "empty" ? (
                    <EmptyState
                        title="Nenhum arquivo enviado ainda"
                        description="Clique em ‘Novo Upload’ para enviar o primeiro laudo ou exame de um paciente."
                    />
                ) : (
                    <div className={`${styles.card} ${styles.fadeIn}`} style={{ marginTop: "2rem" }}>
                        <FilesTable
                            arquivos={arquivos}
                            viewerRole="medico"
                            medicoLogadoId={user?.id}
                            onMutation={carregar}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
