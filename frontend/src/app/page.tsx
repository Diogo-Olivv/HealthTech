import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <Image
                    src="/Icon.svg"
                    alt=""
                    width={72}
                    height={72}
                    className={styles.logo}
                    priority
                />

                <h1 className={styles.title}>
                    Health
                    <span className={styles.textTech}>Tech</span>
                </h1>
                <p className={styles.subtitle}>
                    Bem-vindo! Acesse sua conta ou crie um novo cadastro para
                    começar.
                </p>

                <div className={styles.actions}>
                    <Link
                        href="/login"
                        className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                        Entrar
                    </Link>

                    <Link
                        href="/register"
                        className={`${styles.button} ${styles.buttonSecondary}`}
                    >
                        Criar conta
                    </Link>
                </div>
            </div>
        </main>
    );
}
