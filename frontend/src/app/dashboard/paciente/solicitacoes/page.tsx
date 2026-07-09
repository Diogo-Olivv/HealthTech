"use client";

import { useCallback, useEffect, useState } from "react";
import {
    approveRequest,
    getPendingRequests,
    rejectRequest,
} from "@/services/users.service";
import type { SolicitacaoVinculoDto } from "@/dto/solicitacao-vinculo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import UserIcon from "@/components/icons/UserIcon";
import pageStyles from "@/components/arquivos/ArquivosPage.module.css";
import styles from "./solicitacoes.module.css";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import {
    confirmAlert,
    errorAlert,
    successAlert,
} from "@/utils/alerts";
import { formatDate } from "@/utils/date";
import type { UiStatus } from "@/types/ui-status";

export default function SolicitacoesPacientePage() {
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoVinculoDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [processando, setProcessando] = useState<string | null>(null);

    const carregar = useCallback(async () => {
        setStatus("loading");
        try {
            const dados = await getPendingRequests();
            setSolicitacoes(dados);
            setStatus(dados.length === 0 ? "empty" : "success");
        } catch (err) {
            setErrorMsg(
                mensagemDeErro(err, "Erro ao carregar suas solicitações."),
            );
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const handleAprovar = async (medicoId: string, medicoNome: string) => {
        const confirmado = await confirmAlert({
            icon: "question",
            title: `Aprovar ${medicoNome}?`,
            text: "O médico poderá ver seus exames e enviar arquivos em seu nome. Você pode revogar esse acesso a qualquer momento.",
            confirmButtonText: "Sim, aprovar",
            cancelButtonText: "Cancelar",
        });
        if (!confirmado) return;

        setProcessando(medicoId);
        try {
            await approveRequest(medicoId);
            await successAlert(
                "Solicitação aprovada",
                `${medicoNome} agora tem acesso aos seus exames.`,
            );
            carregar();
        } catch (err) {
            errorAlert(
                "Não foi possível aprovar",
                mensagemDeErro(err, "Tente novamente."),
            );
        } finally {
            setProcessando(null);
        }
    };

    const handleRejeitar = async (medicoId: string, medicoNome: string) => {
        const confirmado = await confirmAlert({
            icon: "warning",
            title: `Rejeitar ${medicoNome}?`,
            text: "O médico não terá acesso aos seus exames.",
            confirmButtonText: "Sim, rejeitar",
            cancelButtonText: "Cancelar",
        });
        if (!confirmado) return;

        setProcessando(medicoId);
        try {
            await rejectRequest(medicoId);
            await successAlert("Solicitação rejeitada");
            carregar();
        } catch (err) {
            errorAlert(
                "Não foi possível rejeitar",
                mensagemDeErro(err, "Tente novamente."),
            );
        } finally {
            setProcessando(null);
        }
    };

    if (status === "loading") return <LoadingState />;
    if (status === "error")
        return <ErrorState msg={errorMsg} onRetry={carregar} />;

    const header = (
        <div className={pageStyles.header}>
            <div className={pageStyles.headerLeft}>
                <h1 className={pageStyles.title}>Solicitações de vínculo</h1>
                <p className={pageStyles.subtitle}>
                    Médicos que pediram acesso aos seus exames e ainda aguardam resposta
                </p>
            </div>
        </div>
    );

    if (status === "empty") {
        return (
            <main>
                <div className={pageStyles.container}>
                    {header}
                    <EmptyState
                        icon={UserIcon}
                        title="Nenhuma solicitação pendente"
                        description="Quando um médico solicitar acesso aos seus exames, a solicitação aparecerá aqui para você aprovar ou rejeitar."
                    />
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className={pageStyles.container}>
                {header}

                <div className={styles.list}>
                    {solicitacoes.map((s) => (
                        <div key={s.medicoId} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.medicoNome}>{s.medicoNome}</h2>
                                <span className={styles.dataSolicitacao}>
                                    Solicitado em {formatDate(s.solicitadoEm)}
                                </span>
                            </div>

                            {s.especialidades.length > 0 && (
                                <div className={styles.especialidades}>
                                    {s.especialidades.map((esp) => (
                                        <span key={esp.id} className={styles.badge}>
                                            {esp.nome}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className={styles.avisoConsentimento}>
                                Ao aprovar, este médico poderá visualizar seus exames e
                                enviar novos arquivos para você. Você pode revogar o acesso
                                a qualquer momento na sua lista de médicos.
                            </p>

                            <div className={styles.acoes}>
                                <button
                                    type="button"
                                    className={styles.btnRejeitar}
                                    onClick={() => handleRejeitar(s.medicoId, s.medicoNome)}
                                    disabled={processando === s.medicoId}
                                >
                                    Rejeitar
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnAprovar}
                                    onClick={() => handleAprovar(s.medicoId, s.medicoNome)}
                                    disabled={processando === s.medicoId}
                                    aria-busy={processando === s.medicoId}
                                >
                                    {processando === s.medicoId
                                        ? "Processando..."
                                        : "Aprovar"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
