import React from "react";
import Image from "next/image";
import styles from "./NavBar.module.css";
interface NavBarProps {
    // Defina as propriedades do componente aqui, se necessário
}

export default function NavBar({}: NavBarProps) {
    return (
        <nav>
            {/* O conteúdo da sua NavBar vai aqui */}
            <div className={styles.navbar__right}>
                <div className={styles.navbar__user}>
                    <div className={styles.navbar__avatar}>BR</div>
                    <div className={styles["navbar__user-info"]}>
                        <span className={styles["navbar__user-name"]}>
                            Nome do Usuario
                        </span>
                        <span className={styles["navbar__user-role"]}>
                            Informações do usuário
                        </span>
                    </div>

                    <div className={styles.navbar__divider}></div>

                    <button className={styles.navbar__logout}>
                        <Image src="/logout-icon.svg" alt="Sair icon" className={styles.logoutIcon} width={18} height={18} />
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
}
