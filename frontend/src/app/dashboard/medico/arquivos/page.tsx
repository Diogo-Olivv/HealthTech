"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getArquivos } from "@/services/arquivos.service";
import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import FilesTable from "@/components/arquivos/FilesTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import Button from "@/components/ui/Button";
import type { UiStatus } from "@/types/ui-status";

export default function ArquivosMedicoPage() {
    const [arquivos, setArquivos] = useState<any[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        async function fetchArquivos() {
            try {
                // No futuro, isso pode ser filtrado só para os arquivos deste médico
                const dados = await getArquivos(); 
                if (cancelled) return;
                
                setArquivos(dados);
                setStatus(dados.length === 0 ? "empty" : "success");
            } catch (err) {
                if (cancelled) return;
                setStatus("error");
            }
        }
        fetchArquivos();

        return () => { cancelled = true; };
    }, []);

    if (status === "loading") return <LoadingState />;
    if (status === "error") return <ErrorState msg="Erro ao carregar os arquivos." />;

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
                    
                    {/* Botão para levar para a tela de Upload que criamos há pouco */}
                    <Button onClick={() => router.push("/dashboard/medico/arquivos/upload")}>
                        Novo Upload
                    </Button>
                </div>

                <div className={styles.card} style={{ marginTop: "2rem" }}>
                    {status === "empty" ? (
                        <EmptyState 
                            title="Nenhum arquivo encontrado"
                            description="Você ainda não enviou nenhum arquivo."
                        />
                    ) : (
                        <FilesTable arquivos={arquivos} viewerRole="medico" />
                    )}
                </div>
            </div>
        </main>
    );
}
