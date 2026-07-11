import styles from "./PatientsTable.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { useState, useMemo } from "react";
import type { PatientsTableProps } from "@/types/tables";

export default function PatientsTable({ pacientes }: PatientsTableProps) {
    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState("nome_asc");

    const pacientesFiltrados = useMemo(() => {
        return pacientes
            .filter((pac) => {
                const termo = busca.toLowerCase();
                return (
                    pac.nome.toLowerCase().includes(termo) ||
                    pac.cpf.includes(termo) ||
                    pac.email.toLowerCase().includes(termo)
                );
            })
            .sort((a, b) => {
                if (ordenacao === "nome_asc") return a.nome.localeCompare(b.nome);
                if (ordenacao === "nome_desc") return b.nome.localeCompare(a.nome);
                if (ordenacao === "data_vinculo_desc") return new Date(b.vinculadoEm).getTime() - new Date(a.vinculadoEm).getTime();
                if (ordenacao === "data_vinculo_asc") return new Date(a.vinculadoEm).getTime() - new Date(b.vinculadoEm).getTime();
                if (ordenacao === "nascimento_desc") return new Date(b.dataNascimento ?? 0).getTime() - new Date(a.dataNascimento ?? 0).getTime();
                if (ordenacao === "nascimento_asc") return new Date(a.dataNascimento ?? 0).getTime() - new Date(b.dataNascimento ?? 0).getTime();
                return 0;
            });
    }, [pacientes, busca, ordenacao]);

    return (
        <div>
            {/* Toolbar de Ações */}
            <div className={styles.toolbar}>
                <input 
                    type="search" 
                    placeholder="Pesquisar paciente por nome, CPF ou e-mail..." 
                    className={styles.searchInput}
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    aria-label="Pesquisar pacientes"
                />
                <select 
                    className={styles.sortSelect} 
                    value={ordenacao} 
                    onChange={(e) => setOrdenacao(e.target.value)}
                    aria-label="Ordenar pacientes"
                >
                    <option value="nome_asc">Nome (A - Z)</option>
                    <option value="nome_desc">Nome (Z - A)</option>
                    <option value="data_vinculo_desc">Vínculos Recentes</option>
                    <option value="data_vinculo_asc">Vínculos Antigos</option>
                    <option value="nascimento_desc">Mais Novos</option>
                    <option value="nascimento_asc">Mais Velhos</option>
                </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table} aria-label="Lista de pacientes">
                    <thead>
                        <tr>
                            <th scope="col">Nome do Paciente</th>
                            <th scope="col">Data de Nascimento</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientesFiltrados.map((paciente) => (
                            <tr key={paciente.pacienteId} tabIndex={0} className={styles.rowItem}>
                                <td className={styles.cellNome}>
                                    {paciente.nome}
                                </td>
                                <td className={styles.cellDate}>
                                    {formatDate(paciente.dataNascimento)}
                                </td>
                                <td>
                                    <Link href={`/dashboard/medico/paciente/${paciente.pacienteId}?nome=${encodeURIComponent(paciente.nome)}`} className={styles.buttonVerExames}>
                                        Ver Exames
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
