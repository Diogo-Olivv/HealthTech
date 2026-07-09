import Link from "next/link";
import styles from "./RegisterTypeTabs.module.css";

type Tipo = "paciente" | "medico";

interface RegisterTypeTabsProps {
    ativo: Tipo;
}

const OPCOES: { tipo: Tipo; label: string; href: string }[] = [
    { tipo: "paciente", label: "Sou Paciente", href: "/register/paciente" },
    { tipo: "medico", label: "Sou Médico", href: "/register/medico" },
];

export default function RegisterTypeTabs({ ativo }: RegisterTypeTabsProps) {
    return (
        <div
            className={styles.tabs}
            role="tablist"
            aria-label="Escolha o tipo de cadastro"
        >
            {OPCOES.map((opt) => {
                const isAtivo = opt.tipo === ativo;
                if (isAtivo) {
                    return (
                        <span
                            key={opt.tipo}
                            role="tab"
                            aria-selected="true"
                            className={`${styles.tab} ${styles.tabActive}`}
                        >
                            {opt.label}
                        </span>
                    );
                }
                return (
                    <Link
                        key={opt.tipo}
                        href={opt.href}
                        role="tab"
                        aria-selected="false"
                        className={styles.tab}
                    >
                        {opt.label}
                    </Link>
                );
            })}
        </div>
    );
}
