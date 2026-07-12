import styles from "./PatientsTable.module.css";
import btnStyles from "./MedicosTable.module.css";
import { formatDate } from "@/utils/date";
import { useState, useMemo } from "react";
import type { MedicosTableProps } from "@/types/tables";

export default function MedicosTable({ medicos, onRevogar, revogandoId }: MedicosTableProps) {
    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState("nome_asc");

    const medicosFiltrados = useMemo(() => {
        return medicos
            .filter((med) => {
                const termo = busca.toLowerCase();
                const especialidadesTexto = (med.especialidades ?? [])
                    .map((e) => e.nome.toLowerCase())
                    .join(" ");
                return (
                    med.nome.toLowerCase().includes(termo) ||
                    (med.especialidade ?? "").toLowerCase().includes(termo) ||
                    especialidadesTexto.includes(termo)
                );
            })
            .sort((a, b) => {
                if (ordenacao === "nome_asc") return a.nome.localeCompare(b.nome);
                if (ordenacao === "nome_desc") return b.nome.localeCompare(a.nome);
                if (ordenacao === "data_vinculo_desc") return new Date(b.vinculadoEm).getTime() - new Date(a.vinculadoEm).getTime();
                if (ordenacao === "data_vinculo_asc") return new Date(a.vinculadoEm).getTime() - new Date(b.vinculadoEm).getTime();
                if (ordenacao === "especialidade_asc") return a.especialidade.localeCompare(b.especialidade);
                return 0;
            });
    }, [medicos, busca, ordenacao]);

    return (
        <div>
            {/* Toolbar de Ações */}
            <div className={styles.toolbar}>
                <input 
                    type="search" 
                    placeholder="Pesquisar médico por nome ou especialidade..." 
                    className={styles.searchInput}
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    aria-label="Pesquisar médicos"
                />
                <select 
                    className={styles.sortSelect} 
                    value={ordenacao} 
                    onChange={(e) => setOrdenacao(e.target.value)}
                    aria-label="Ordenar médicos"
                >
                    <option value="nome_asc">Nome (A - Z)</option>
                    <option value="nome_desc">Nome (Z - A)</option>
                    <option value="especialidade_asc">Especialidade (A - Z)</option>
                    <option value="data_vinculo_desc">Vínculos Recentes</option>
                    <option value="data_vinculo_asc">Vínculos Antigos</option>
                </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table} aria-label="Lista de médicos">
                    <thead>
                        <tr>
                            <th scope="col">Nome do Médico</th>
                            <th scope="col">Especialidade</th>
                            <th scope="col">Data do Vínculo</th>
                            {onRevogar && <th scope="col">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {medicosFiltrados.map((medico) => {
                            const especialidades = medico.especialidades ?? [];
                            const visiveis = especialidades.slice(0, 2);
                            const extras = especialidades.length - visiveis.length;

                            return (
                                <tr key={medico.medicoId} tabIndex={0} className={styles.rowItem}>
                                    <td className={styles.cellNome}>{medico.nome}</td>
                                    <td>
                                        {especialidades.length === 0 ? (
                                            <span className={styles.tipoBadge}>
                                                {medico.especialidade}
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    flexWrap: "wrap",
                                                    gap: "0.25rem",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {visiveis.map((esp) => (
                                                    <span
                                                        key={esp.id}
                                                        className={styles.tipoBadge}
                                                    >
                                                        {esp.nome}
                                                    </span>
                                                ))}
                                                {extras > 0 && (
                                                    <span
                                                        className={styles.tipoBadge}
                                                        title={especialidades
                                                            .slice(2)
                                                            .map((e) => e.nome)
                                                            .join(", ")}
                                                    >
                                                        +{extras}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </td>
                                    <td className={styles.cellDate}>
                                        {formatDate(medico.vinculadoEm)}
                                    </td>
                                    {onRevogar && (
                                        <td>
                                            <button
                                                type="button"
                                                className={btnStyles.btnRevogar}
                                                onClick={() => onRevogar(medico.medicoId, medico.nome)}
                                                disabled={revogandoId === medico.medicoId}
                                                aria-busy={revogandoId === medico.medicoId}
                                                aria-label={`Revogar acesso de ${medico.nome}`}
                                            >
                                                {revogandoId === medico.medicoId && (
                                                    <span
                                                        className={btnStyles.spinner}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {revogandoId === medico.medicoId
                                                    ? "Revogando..."
                                                    : "Revogar acesso"}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
