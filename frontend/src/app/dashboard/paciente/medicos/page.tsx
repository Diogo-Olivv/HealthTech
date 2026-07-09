"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyMedicos } from "@/services/users.service";
import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import MedicosTable from "@/components/arquivos/MedicosTable";
import UserIcon from "@/components/icons/UserIcon";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import type { UiStatus } from "@/types/ui-status";

export default function MeusMedicosPage() {
    const [medicos, setMedicos] = useState<MedicoVinculadoDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    const carregar = useCallback(async () => {
        setStatus("loading");
        try {
            const dados = await getMyMedicos();
            setMedicos(dados);
            setStatus(dados.length === 0 ? "empty" : "success");
        } catch (err) {
            setErrorMsg(mensagemDeErro(err, "Erro ao carregar seus médicos."));
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    if (status === "loading") return <LoadingState />;
    if (status === "error")
        return <ErrorState msg={errorMsg} onRetry={carregar} />;

    const header = (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <h1 className={styles.title}>Meus Médicos</h1>
                <p className={styles.subtitle}>
                    Médicos que possuem acesso ao seu histórico de exames
                </p>
            </div>
        </div>
    );

    if (status === "empty") {
        return (
            <main>
                <div className={styles.container}>
                    {header}
                    <EmptyState
                        icon={UserIcon}
                        title="Nenhum médico vinculado"
                        description="Assim que um médico solicitar acesso ao seu histórico e for confirmado, ele aparecerá aqui."
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
                    <MedicosTable medicos={medicos} />
                </div>
            </div>
        </main>
    );
}
