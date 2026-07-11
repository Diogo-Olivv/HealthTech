"use client";

import { useCallback, useEffect, useState } from "react";
import { getSentRequests } from "@/services/users.service";
import type { SolicitacaoEnviadaDto } from "@/dto/solicitacao-vinculo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import UserIcon from "@/components/icons/UserIcon";
import pageStyles from "@/components/arquivos/ArquivosPage.module.css";
import styles from "./solicitacoes.module.css";
import { formatDate } from "@/utils/date";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import type { UiStatus } from "@/types/ui-status";

export default function SolicitacoesEnviadasPage() {
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoEnviadaDto[]>([]);
    const [status, setStatus] = useState<UiStatus>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    const carregar = useCallback(async () => {
        setStatus("loading");
        try {
            const dados = await getSentRequests();
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

    if (status === "loading") return <LoadingState />;
    if (status === "error")
        return <ErrorState msg={errorMsg} onRetry={carregar} />;

    const header = (
        <div className={pageStyles.header}>
            <div className={pageStyles.headerLeft}>
                <h1 className={pageStyles.title}>Solicitações enviadas</h1>
                <p className={pageStyles.subtitle}>
                    Acompanhe o status das solicitações de vínculo que você enviou aos pacientes
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
                        title="Nenhuma solicitação enviada"
                        description="Quando você solicitar vínculo com um paciente, o status aparecerá aqui até que ele responda."
                    />
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className={pageStyles.container}>
                {header}

                <ul className={styles.list} aria-label="Solicitações enviadas">
                    {solicitacoes.map((s) => (
                        <li
                            key={`${s.pacienteId}-${s.status}`}
                            className={styles.item}
                        >
                            <div>
                                <p className={styles.nome}>{s.pacienteNome}</p>
                                <span className={styles.data}>
                                    Solicitado em {formatDate(s.solicitadoEm)}
                                    {s.status === "REJEITADO" && s.respondidoEm && (
                                        <>
                                            {" · "}
                                            Rejeitado em {formatDate(s.respondidoEm)}
                                        </>
                                    )}
                                </span>
                            </div>
                            <span
                                className={
                                    s.status === "PENDENTE"
                                        ? styles.badgePendente
                                        : styles.badgeRejeitado
                                }
                            >
                                {s.status === "PENDENTE"
                                    ? "Aguardando resposta"
                                    : "Rejeitada"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
