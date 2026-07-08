"use client";

import { useEffect, useState } from "react";
import { getMyMedicos } from "@/services/users.service";
import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import MedicosTable from "@/components/arquivos/MedicosTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import type { UiStatus } from "@/types/ui-status";

export default function MeusMedicosPage() {
    const [medicos, setMedicos] = useState<MedicoVinculadoDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");

    useEffect(() => {
        let cancelled = false;
        async function fetchMedicos() {
            try {
                const dados = await getMyMedicos();
                if (cancelled) return;
                setMedicos(dados);
                setStatus(dados.length === 0 ? "empty" : "success");
            } catch (err) {
                if (cancelled) return;
                setStatus("error");
            }
        }
        fetchMedicos();
        return () => { cancelled = true; };
    }, []);

    if (status === "loading") return <LoadingState />;
    if (status === "error") return <ErrorState msg="Erro ao carregar seus médicos." />;

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Meus Médicos</h1>
                        <p className={styles.subtitle}>
                            Médicos que possuem acesso ao seu histórico de exames
                        </p>
                    </div>
                </div>

                <div className={styles.card} style={{ marginTop: "2rem" }}>
                    {status === "empty" ? (
                        <EmptyState 
                            title="Nenhum médico vinculado"
                            description="Você ainda não foi vinculado a nenhum médico."
                        />
                    ) : (
                        <MedicosTable medicos={medicos} />
                    )}
                </div>
            </div>
        </main>
    );
}
