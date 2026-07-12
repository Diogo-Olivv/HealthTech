import type { AuditLogDto } from "@/dto/audit-log.dto";
import { StatusAuditoria } from "@/dto/audit-log.dto";
import tableStyles from "@/components/arquivos/FilesTable.module.css";
import styles from "./AuditTable.module.css";

interface AuditTableProps {
    logs: AuditLogDto[];
}

const DATA_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
});

function encurtar(id: string | null): string {
    if (!id) return "";
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export default function AuditTable({ logs }: AuditTableProps) {
    return (
        <div className={tableStyles.tableWrapper}>
            <table className={tableStyles.table}>
                <thead>
                    <tr>
                        <th>Data e hora</th>
                        <th>Evento</th>
                        <th>Status</th>
                        <th>Usuário</th>
                        <th>Recurso</th>
                        <th>IP origem</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} className={tableStyles.rowItem}>
                            <td className={tableStyles.cellDate}>
                                {DATA_FORMATTER.format(new Date(log.timestamp))}
                            </td>
                            <td>
                                <span className={tableStyles.tipoBadge}>{log.tipoEvento}</span>
                            </td>
                            <td>
                                <span
                                    className={
                                        log.status === StatusAuditoria.SUCCESS
                                            ? styles.statusSuccess
                                            : styles.statusFailure
                                    }
                                >
                                    {log.status}
                                </span>
                            </td>
                            <td className={styles.mono} title={log.userId ?? ""}>
                                {log.userId ? encurtar(log.userId) : <span className={styles.dash}>—</span>}
                            </td>
                            <td className={styles.mono} title={log.recursoId ?? ""}>
                                {log.recursoId ? encurtar(log.recursoId) : <span className={styles.dash}>—</span>}
                            </td>
                            <td className={styles.mono}>{log.ipOrigem}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
