import type { ArquivoDto } from '@/dto/arquivo.dto';
import { FileIcon } from './Icons';
import styles from './FilesTable.module.css';

interface Props {
  arquivos: ArquivoDto[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function FilesTable({ arquivos }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} aria-label="Lista de arquivos do médico">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Tipo</th>
            <th scope="col">Data de upload</th>
            <th scope="col">Médico</th>
          </tr>
        </thead>
        <tbody>
          {arquivos.map((arquivo) => (
            <tr key={arquivo.id}>
              <td>
                <span className={styles.cellNome}>
                  <FileIcon className={styles.fileIcon} />
                  {arquivo.nome}
                </span>
              </td>
              <td><span className={styles.tipoBadge}>{arquivo.tipo}</span></td>
              <td className={styles.cellDate}>{formatDate(arquivo.dataUpload)}</td>
              <td className={styles.cellEnviado}>{arquivo.medicoId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}