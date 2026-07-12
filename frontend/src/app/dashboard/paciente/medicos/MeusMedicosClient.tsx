"use client";

import { useState } from "react";
import { revokeAccess } from "@/services/users.service";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import MedicosTable from "@/components/arquivos/MedicosTable";
import UserIcon from "@/components/icons/UserIcon";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import { confirmAlert, errorAlert, successAlert } from "@/utils/alerts";
import { useMeusMedicos } from "@/hooks/medicos/useMeusMedicos";
import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";

interface Props {
    initialData: MedicoVinculadoDto[];
}

export default function MeusMedicosClient({ initialData }: Props) {
    const { data: medicos, status, error, refetch, setData } = useMeusMedicos(initialData);
    const [revogandoId, setRevogandoId] = useState<string | null>(null);

    const handleRevogar = async (medicoId: string, medicoNome: string) => {
        const confirmado = await confirmAlert({
            icon: "warning",
            title: `Revogar acesso de ${medicoNome}?`,
            text: "O médico perderá o acesso aos seus exames e não poderá mais enviar arquivos para você. Ele precisará solicitar um novo vínculo se quiser voltar.",
            confirmButtonText: "Sim, revogar",
            cancelButtonText: "Cancelar",
        });
        if (!confirmado) return;

        const snapshot = medicos ?? [];
        setData((current) => (current ?? []).filter((m) => m.medicoId !== medicoId));
        setRevogandoId(medicoId);
        try {
            await revokeAccess(medicoId);
            await successAlert("Acesso revogado");
            refetch();
        } catch (err) {
            setData(snapshot);
            errorAlert(
                "Não foi possível revogar",
                mensagemDeErro(err, "Tente novamente."),
            );
        } finally {
            setRevogandoId(null);
        }
    };

    if (status === "error") return <ErrorState msg={error} onRetry={refetch} />;

    if (status === "empty") {
        return (
            <EmptyState
                icon={UserIcon}
                title="Nenhum médico vinculado"
                description="Assim que um médico solicitar acesso ao seu histórico e for confirmado, ele aparecerá aqui."
            />
        );
    }

    return (
        <div className={`${styles.card} ${styles.fadeIn}`}>
            <MedicosTable
                medicos={medicos ?? []}
                onRevogar={handleRevogar}
                revogandoId={revogandoId}
            />
        </div>
    );
}
