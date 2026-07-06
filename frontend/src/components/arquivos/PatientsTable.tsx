import styles from "./PatientsTable.module.css";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto";

// Formata a data (ex: 04/07/2026)
function formatDate(iso?: string): string {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

interface Props {
    pacientes: PacienteVinculadoDto[];
}

export default function PatientsTable({ pacientes }: Props) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="Lista de pacientes">
                <thead>
                    <tr>
                        <th scope="col">Nome do Paciente</th>
                        <th scope="col">Data do Vínculo</th>
                        <th scope="col">Data de Nascimento</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.pacienteId}>
                            <td className={styles.cellNome}>
                                {paciente.nome}
                            </td>
                            <td className={styles.cellDate}>
                                {formatDate(paciente.vinculadoEm)}
                            </td>
                           <td className={styles.cellDate}>
                                {formatDate(paciente.dataNascimento)}
                            </td>
                            <td>
                                <button className={styles.buttonVerExames}>
                                    Ver Exames
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
