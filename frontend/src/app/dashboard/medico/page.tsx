"use client";

import { useState } from "react";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import PatientsTable from "@/components/arquivos/PatientsTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import Button from "@/components/ui/Button";
import { ModalVinculo } from "@/components/arquivos/ModalVinculo";
import { contarExamesUltimosDias } from "@/utils/arquivos";
import UserPlusIcon from "@/components/icons/UserPlusIcon";
import UserIcon from "@/components/icons/UserIcon";
import { useMeusPacientes } from "@/hooks/medicos/useMeusPacientes";
import { useArquivos } from "@/hooks/arquivos/useArquivos";

export default function MedicoPainelPage() {
    const pacientesQuery = useMeusPacientes();
    const arquivosQuery = useArquivos();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isLoading =
        pacientesQuery.status === "loading" || arquivosQuery.status === "loading";
    const errorMsg = pacientesQuery.error || arquivosQuery.error;

    const recarregar = () => {
        pacientesQuery.refetch();
        arquivosQuery.refetch();
    };

    if (isLoading) return <LoadingState />;
    if (errorMsg) return <ErrorState msg={errorMsg} onRetry={recarregar} />;

    const pacientes = pacientesQuery.data ?? [];
    const examesSemana = contarExamesUltimosDias(arquivosQuery.data ?? [], 7);

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

                    <Button
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Abrir modal para solicitar vínculo com novo paciente"
                    >
                        <UserPlusIcon />
                        Solicitar Vínculo
                    </Button>
                </div>

                <div className={styles.resume}>
                    <div
                        className={styles.cardResume}
                        role="group"
                        aria-label="Pacientes vinculados"
                    >
                        <img src="/pacientCard.svg" alt="" aria-hidden="true" />
                        <p>Pacientes vinculados</p>
                        <h2 aria-live="polite">{pacientes.length}</h2>
                    </div>
                    <div
                        className={styles.cardResume}
                        role="group"
                        aria-label="Exames enviados esta semana"
                    >
                        <img src="/FileIcon.svg" alt="" aria-hidden="true" />
                        <p>Exames enviados esta semana</p>
                        <h2 aria-live="polite">{examesSemana}</h2>
                    </div>
                </div>

                {pacientes.length === 0 ? (
                    <EmptyState
                        icon={UserIcon}
                        description="Quando um paciente aprovar sua solicitação, ele aparecerá aqui. Clique em ‘Solicitar Vínculo’ para enviar um convite."
                        title="Nenhum paciente vinculado"
                    />
                ) : (
                    <div className={`${styles.card} ${styles.fadeIn}`}>
                        <PatientsTable pacientes={pacientes} />
                    </div>
                )}

                <ModalVinculo
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={recarregar}
                />
            </div>
        </main>
    );
}
