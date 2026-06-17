import type { ArquivoDto } from '@/dto/arquivo.dto';
import FileIcon from '@/components/icons/FileIcon';
import styles from './FilesTable.module.css';

export type ViewerRole = 'medico' | 'paciente';

interface Props {
  arquivos: ArquivoDto[];
  viewerRole: ViewerRole;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function formatTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesTable({ arquivos, viewerRole }: Props) {
  const isMedico = viewerRole === 'medico';
  const partyHeader = isMedico ? 'Paciente' : 'Enviado por';
  const ariaLabel = isMedico
    ? 'Lista de arquivos do médico'
    : 'Lista de arquivos do paciente';

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} aria-label={ariaLabel}>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Tipo</th>
            <th scope="col">Tamanho</th>
            <th scope="col">Data de upload</th>
            <th scope="col">{partyHeader}</th>
          </tr>
        </thead>
        <tbody>
          {arquivos.map((arquivo) => (
            <tr key={arquivo.id}>
              <td>
                <span className={styles.cellNome}>
                  <FileIcon className={styles.fileIcon} />
                  {arquivo.nomeOriginal}
                </span>
              </td>
              <td><span className={styles.tipoBadge}>{arquivo.tipo}</span></td>
              <td className={styles.cellDate}>{formatTamanho(arquivo.tamanho)}</td>
              <td className={styles.cellDate}>{formatDate(arquivo.dataUpload)}</td>
              <td className={styles.cellEnviado}>
                {isMedico ? arquivo.pacienteNome : arquivo.medicoNome}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
