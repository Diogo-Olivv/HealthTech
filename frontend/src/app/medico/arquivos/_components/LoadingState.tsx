import styles from '../page.module.css';

export default function LoadingState() {
  return (
    <div className={styles.card} role="status" aria-live="polite">
      <div className={styles.stateContainer}>
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.stateText}>Carregando arquivos...</p>
      </div>
    </div>
  );
}