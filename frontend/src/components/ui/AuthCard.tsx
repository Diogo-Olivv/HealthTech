import styles from './AuthCard.module.css';

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {children}
      </div>
    </div>
  );
}
