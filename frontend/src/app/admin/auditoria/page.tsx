"use client";

import { useMemo, useState } from "react";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import AuditTable from "@/components/audit/AuditTable";
import pageStyles from "./AuditoriaPage.module.css";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import { TipoEventoAuditoria } from "@/dto/audit-log.dto";
import { useAuditLogs } from "@/hooks/audit/useAuditLogs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const LIMITE_POR_PAGINA = 20;

function dateInputToIso(value: string, endOfDay = false): string | undefined {
    if (!value) return undefined;
    return endOfDay ? `${value}T23:59:59.999Z` : `${value}T00:00:00.000Z`;
}

export default function AuditoriaPage() {
    const [page, setPage] = useState(1);
    const [usuarioInput, setUsuarioInput] = useState("");
    const [tipoEvento, setTipoEvento] = useState<TipoEventoAuditoria | "">("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const debouncedUsuario = useDebouncedValue(usuarioInput.trim(), 400);

    const query = useMemo(
        () => ({
            page,
            limit: LIMITE_POR_PAGINA,
            usuario: debouncedUsuario || undefined,
            tipoEvento: tipoEvento || undefined,
            dataInicio: dateInputToIso(dataInicio),
            dataFim: dateInputToIso(dataFim, true),
        }),
        [page, debouncedUsuario, tipoEvento, dataInicio, dataFim],
    );

    const { data, status, error, refetch } = useAuditLogs(query);

    const itens = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_POR_PAGINA));
    const semResultados = status === "success" && itens.length === 0;

    const handleFilterChange = (setter: (value: string) => void) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setter(event.target.value);
            setPage(1);
        };

    const renderFiltros = () => (
        <div className={pageStyles.toolbar}>
            <div className={pageStyles.filterGroup}>
                <label htmlFor="filtro-usuario" className={pageStyles.filterLabel}>
                    Usuário
                </label>
                <input
                    id="filtro-usuario"
                    type="text"
                    placeholder="Nome ou e-mail"
                    className={pageStyles.filterInput}
                    value={usuarioInput}
                    onChange={(e) => {
                        setUsuarioInput(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <div className={pageStyles.filterGroup}>
                <label htmlFor="filtro-evento" className={pageStyles.filterLabel}>
                    Evento
                </label>
                <select
                    id="filtro-evento"
                    className={pageStyles.filterInput}
                    value={tipoEvento}
                    onChange={(e) => {
                        setTipoEvento(e.target.value as TipoEventoAuditoria | "");
                        setPage(1);
                    }}
                >
                    <option value="">Todos</option>
                    {Object.values(TipoEventoAuditoria).map((evento) => (
                        <option key={evento} value={evento}>
                            {evento}
                        </option>
                    ))}
                </select>
            </div>

            <div className={pageStyles.filterGroup}>
                <label htmlFor="filtro-data-inicio" className={pageStyles.filterLabel}>
                    Data início
                </label>
                <input
                    id="filtro-data-inicio"
                    type="date"
                    className={pageStyles.filterInput}
                    value={dataInicio}
                    onChange={handleFilterChange(setDataInicio)}
                    max={dataFim || undefined}
                />
            </div>

            <div className={pageStyles.filterGroup}>
                <label htmlFor="filtro-data-fim" className={pageStyles.filterLabel}>
                    Data fim
                </label>
                <input
                    id="filtro-data-fim"
                    type="date"
                    className={pageStyles.filterInput}
                    value={dataFim}
                    onChange={handleFilterChange(setDataFim)}
                    min={dataInicio || undefined}
                />
            </div>
        </div>
    );

    const renderContent = () => {
        if (status === "error") {
            return <ErrorState msg={error} onRetry={refetch} />;
        }

        if (status === "loading" && !data) {
            return <LoadingState />;
        }

        if (semResultados) {
            return (
                <EmptyState
                    title="Nenhum log encontrado"
                    description="Ajuste os filtros para consultar outros períodos ou eventos."
                />
            );
        }

        return (
            <>
                <AuditTable logs={itens} />
                <div className={pageStyles.footerBar}>
                    <span className={pageStyles.totalInfo}>
                        {total} {total === 1 ? "registro" : "registros"}
                    </span>
                    <div className={pageStyles.pagination}>
                        <button
                            type="button"
                            className={pageStyles.paginationBtn}
                            disabled={page <= 1 || status === "loading"}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            Anterior
                        </button>
                        <span className={pageStyles.paginationText}>
                            Página {page} de {totalPaginas}
                        </span>
                        <button
                            type="button"
                            className={pageStyles.paginationBtn}
                            disabled={page >= totalPaginas || status === "loading"}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Auditoria do sistema</h1>
                        <p className={styles.subtitle}>
                            Consulte eventos registrados com filtros por usuário, evento e período.
                        </p>
                    </div>
                    <span className={styles.badge} aria-label="Perfil admin">Admin</span>
                </div>

                <div className={`${styles.card} ${styles.fadeIn}`}>
                    {renderFiltros()}
                    {renderContent()}
                </div>
            </div>
        </main>
    );
}
