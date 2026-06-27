import type { Metadata } from "next";
import styles from "./dashboard.module.css";


export const metadata: Metadata = {
  title: "HealthTech",
  description: "AILAB - Makers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
            
            
                <div className={styles.navbar__right}>
                    <div className={styles.navbar__user}>
                        <div className={styles.navbar__avatar}>BR</div>
                        <div className={styles["navbar__user-info"]}>
                            <span className={styles["navbar__user-name"]}>Nome do Usuario</span>
                            <span className={styles["navbar__user-role"]}>Informações do usuário</span>
                        </div>
                    </div>

                <div className={styles.navbar__divider}></div>

                    <button className={styles.navbar__logout}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sair
                    </button>
                </div>

            <main style={{ flex: 1 }}>
                {children}              
            </main>

        </div>                     
);
}