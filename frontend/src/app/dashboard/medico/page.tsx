"use client";

import { useEffect, useState } from "react";
import { getMyPatients, getToken } from "@/services/users.service";
import { getArquivos } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import PatientsTable from "@/components/arquivos/PatientsTable";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto"
import styles from "@/components/arquivos/ArquivosPage.module.css";
import Button from "@/components/ui/Button";
import { ModalVinculo } from "@/components/arquivos/ModalVinculo";
import type { UiStatus } from "@/types/ui-status";
import { contarExamesUltimosDias } from "@/utils/arquivos";

export default function MedicoPainelPage() {
    const [pacientes, setPacientes] = useState<PacienteVinculadoDto[]>([]);
    const [examesSemana, setExamesSemana] = useState(0);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        async function fetchPacientes() {
            setStatus("loading");
            const token = getToken();
            if (!token) return;
            
            try {
                const [dadosPacientes, dadosArquivos] = await Promise.all([
                    getMyPatients(),
                    getArquivos()
                ]);

                if (cancelled) return;
                setPacientes(dadosPacientes);
                
                setExamesSemana(contarExamesUltimosDias(dadosArquivos, 7));


                setStatus(dadosPacientes.length === 0 ? "empty" : "success");
            } catch (err) {
                if (cancelled) return;
                setErrorMsg("Erro ao carregar os dados do painel.");
                setStatus("error");
            }
        }
        fetchPacientes();

        return () => {
            cancelled = true;
        };
    }, [refreshKey]);


    if (status === "loading") return <LoadingState />;
    if (status === "error") return <ErrorState msg={errorMsg} />;


    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Painel Clínico</h1>
                        <p className={styles.subtitle}>
                            Pacientes vinculados ao seu perfil
                        </p>
                    </div>
                    <span className={styles.badge} aria-label="Perfil médico">
                        Médico
                    </span>
                </div>

                <div className={styles.resume}>
                    <div className={styles.cardResume} aria-label="Pacientes Ativos">
                        <img src="/pacientCard.svg" alt="Paciente" />
                        <p>Pacientes vinculados</p>
                        <h2>{pacientes.length}</h2>
                    </div>
                    <div className={styles.cardResume} aria-label="Exames enviados esta semana">
                        <img src="/FileIcon.svg" alt="Exames" />
                        <p>Exames enviados esta semana</p>
                        <h2>{examesSemana}</h2>
                    </div>
                </div>

                <div className={styles.actionsContainer}>

                    <Button onClick={() => setIsModalOpen(true)}>
                        Vincular Paciente
                    </Button>
                </div>

                <div className={`${styles.card} ${styles.fadeIn}`}>
                    {pacientes.length === 0 ? (
                        <EmptyState 
                            description="Quando Pacientes forem vinculados ao seu perfil, eles aparecerão aqui." 
                            title="Nenhum paciente encontrado" 
                        />
                    ) : (
                        <PatientsTable pacientes={pacientes} />
                    )}
                </div>

                <ModalVinculo 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => setRefreshKey(old => old + 1)}
                />
            </div>
        </main>
    );
}
