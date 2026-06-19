import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.splitLayout}>
      <aside className={styles.sidePanel}>
        <div className={styles.brand}>
          <div className={styles.logoBlock}>
            <img
              src="/Icon.svg"
              alt="Logo HealthTech"
              className={styles.logo}
            />
            <h1 className={styles.brandName}>
              Health<span>Tech</span>
            </h1>
          </div>

          <div className={styles.copy}>
            <h2 className={styles.tagline}>
              Exames médicos seguros, compartilhados com clareza.
            </h2>
            <p className={styles.description}>
              Conecte pacientes e médicos em um ambiente clínico, criptografado
              e acessível.
            </p>
          </div>
        </div>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
