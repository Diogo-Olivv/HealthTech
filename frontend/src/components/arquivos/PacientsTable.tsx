import styles from "./PacientsTable.module.css";

// Formata a data (ex: 04/07/2026)
function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

// Essa é a estrutura que o backend manda para a gente!
interface PacienteVinculado {
    pacienteId: string;
    nome: string;
    vinculadoEm: string;
}

interface Props {
    pacientes: PacienteVinculado[];
}

export default function PacientsTable({ pacientes }: Props) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="Lista de pacientes">
                <thead>
                    <tr>
                        <th scope="col">Nome do Paciente</th>
                        <th scope="col">Data do Vínculo</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.pacienteId}>
                            <td>
                                <span className={styles.cellNome}>
                                    <strong>{paciente.nome}</strong>
                                </span>
                            </td>
                            <td className={styles.cellDate}>
                                {formatDate(paciente.vinculadoEm)}
                            </td>
                            <td>
                                <button style={{ padding: '6px 12px', background: '#e0e7ff', color: '#3730a3', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
