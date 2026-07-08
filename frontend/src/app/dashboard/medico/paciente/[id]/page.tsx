"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getProntuarioPaciente } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import FilesTable from "@/components/arquivos/FilesTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import UploadCloudIcon from "@/components/icons/UploadCloudIcon";
import type { UiStatus } from "@/types/ui-status";


export default function ProntuarioPacientePage() {
    const params = useParams();
    const pacienteId = params.id as string;

    const searchParams = useSearchParams();
    const nomeDoPaciente = searchParams.get("nome") || "Paciente";
    const router = useRouter();
    
    const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!pacienteId) return;

        // AbortController cancela o carregamento se o médico mudar de página rápido demais
        const controller = new AbortController();
        
        async function fetchProntuario() {
            setStatus("loading");
            try {
                const data = await getProntuarioPaciente(pacienteId, controller.signal);
                setArquivos(data);
                setStatus(data.length === 0 ? "empty" : "success");
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setErrorMsg(err instanceof Error ? err.message : "Erro ao carregar o prontuário.");
                setStatus("error");
            }
        }
        
        fetchProntuario();
        
        return () => {
            controller.abort(); 
        };
    }, [pacienteId]);

    const renderHeader = () => {
        return (
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Prontuário de {nomeDoPaciente}</h1>
                    <p className={styles.subtitle}>
                        Histórico consolidado de exames e laudos
                    </p>
                </div>

                <Button onClick={() => router.push("/dashboard/medico/arquivos/upload")}>
                    <UploadCloudIcon />
                    Novo Upload
                </Button>
            </div>
        );
    };



    if (status === "loading") return <main><div className={styles.container}>{renderHeader()}<LoadingState /></div></main>;
    if (status === "error") return <main><div className={styles.container}>{renderHeader()}<ErrorState msg={errorMsg} /></div></main>;

    return (
        <main>
            <div className={styles.container}>
                {renderHeader()}

                <div className={`${styles.card} ${styles.fadeIn}`}>
                    {status === "empty" ? (
                        <EmptyState 
                            title="Nenhum arquivo encontrado" 
                            description="Este paciente ainda não possui nenhum laudo ou exame registrado no sistema." 
                        />
                    ) : (

                        <FilesTable arquivos={arquivos} viewerRole="paciente" />
                    )}
                </div>
            </div>
        </main>
    );
}
