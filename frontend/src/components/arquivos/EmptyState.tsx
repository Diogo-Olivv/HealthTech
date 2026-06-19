import InboxIcon from '@/components/icons/InboxIcon';
import styles from './ArquivosPage.module.css';

interface Props {
  description: string;
}

export default function EmptyState({ description }: Props) {
  return (
    <div className={styles.card} aria-live="polite">
      <div className={styles.stateContainer}>
        <InboxIcon className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>Nenhum arquivo encontrado</p>
        <p className={styles.emptyDesc}>{description}</p>
      </div>
    </div>
  );
}
