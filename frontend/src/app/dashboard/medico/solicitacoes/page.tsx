"use client";

import LoadingState from "@/components/arquivos/LoadingState";
import ErrorState from "@/components/arquivos/ErrorState";
import EmptyState from "@/components/arquivos/EmptyState";
import UserIcon from "@/components/icons/UserIcon";
import pageStyles from "@/components/arquivos/ArquivosPage.module.css";
import styles from "./solicitacoes.module.css";
import { formatDate } from "@/utils/date";
import { useSolicitacoesEnviadas } from "@/hooks/solicitacoes/useSolicitacoesEnviadas";

export default function SolicitacoesEnviadasPage() {
    const { data: solicitacoes, status, error, refetch } = useSolicitacoesEnviadas();

    if (status === "loading") return <LoadingState />;
    if (status === "error")
        return <ErrorState msg={error} onRetry={refetch} />;

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
                    {(solicitacoes ?? []).map((s) => (
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
