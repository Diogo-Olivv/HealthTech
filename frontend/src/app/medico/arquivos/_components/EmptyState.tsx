import { InboxIcon } from './Icons';
import styles from '../page.module.css';

export default function EmptyState() {
  return (
    <div className={styles.card} aria-live="polite">
      <div className={styles.stateContainer}>
        <InboxIcon className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>Nenhum arquivo encontrado</p>
        <p className={styles.emptyDesc}>
          Quando documentos forem vinculados ao seu perfil, eles aparecerão aqui.
        </p>
      </div>
    </div>
  );
}