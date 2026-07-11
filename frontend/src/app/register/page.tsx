import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import styles from "./register.module.css";

export default function RegisterPage() {
    return (
        <AuthCard>
            <h1 className={styles.title}>Crie sua conta</h1>
            <p className={styles.subtitle}>
                Junte-se à plataforma
                <span className={styles.textHealth}> HealthTech</span>
            </p>

            <div
                className={styles.registerOptions}
                role="group"
                aria-label="Selecione o tipo de conta"
            >
                <Link
                    href="/register/paciente"
                    className={styles.optionCard}
                    aria-label="Cadastrar como paciente"
                >
                    <span className={styles.optionTitle}>Sou Paciente</span>
                    <span className={styles.optionDescription}>
                        Acompanhe seus exames e laudos enviados pelo seu médico.
                    </span>
                </Link>
                <Link
                    href="/register/medico"
                    className={styles.optionCard}
                    aria-label="Cadastrar como médico"
                >
                    <span className={styles.optionTitle}>Sou Médico</span>
                    <span className={styles.optionDescription}>
                        Vincule pacientes e gerencie seus laudos e exames.
                    </span>
                </Link>
            </div>

            <p className={styles.footer}>
                Já tem uma conta? <Link href="/login">Fazer login</Link>
            </p>
        </AuthCard>
    );
}
