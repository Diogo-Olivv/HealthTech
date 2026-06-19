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

      <div className={styles.registerOptions}>
        <Link href="/register/paciente" className={styles.optionCard}>
          Sou Paciente
        </Link>
        <Link href="/register/medico" className={styles.optionCard}>
          Sou Médico
        </Link>
      </div>

      <p className={styles.footer}>
        Já tem uma conta? <Link href="/login">Fazer login</Link>
      </p>
    </AuthCard>
  );
}
