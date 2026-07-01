"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./NavBar.module.css";
import { getProfile, getToken, clearToken } from "@/services/users.service";
import type { PublicUser } from "@/dto/public-user";

interface NavBarProps {
    // Defina as propriedades do componente aqui, se necessário
}

export default function NavBar({ }: NavBarProps) {
    const [user, setUser] = useState<PublicUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (token) {
                try {
                    const profile = await getProfile(token);
                    setUser(profile);
                } catch (error) {
                    clearToken();
                    // Sessão expirada ou inválida
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        clearToken();
        window.location.href = "/";
    };

    return (
        <nav>
            {/* O conteúdo da sua NavBar vai aqui */}
            <div className={styles.navbar__right}>
                <a href="/dashboard">
                    <img src="/logo-transparent-azul.svg" alt="Logo HealthTech" className={styles.navbar__logo} />
                </a>
                <div className={styles.navbar__user}>
                    <div className={styles.navbar__avatar}>
                        {user ? user.name.substring(0, 2).toUpperCase() : "??"}
                    </div>
                    <div className={styles["navbar__user-info"]}>
                        <span className={styles["navbar__user-name"]}>
                            {user ? user.name : "Carregando..."}
                        </span>
                        <span className={styles["navbar__user-role"]}>
                            {user ? user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1).toLowerCase() : "Autenticando"}
                        </span>
                    </div>

                    <div className={styles.navbar__divider}></div>

                    <button className={styles.navbar__logout} onClick={handleLogout}>
                        <Image src="/logout-icon.svg" alt="Sair icon" className={styles.logoutIcon} width={18} height={18} />
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
}
