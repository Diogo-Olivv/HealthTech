"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./NavBar.module.css";
import { getProfile, getToken, clearToken } from "@/services/users.service";
import type { PublicUser } from "@/dto/public-user";


export default function NavBar() {
    const router = useRouter();
    const [user, setUser] = useState<PublicUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (token) {
                try {
                    const profile = await getProfile();
                    setUser(profile);
                } catch (error) {
                    clearToken();
                    router.push("/");
                    // Sessão expirada ou inválida
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        clearToken();
        router.push("/");
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };


    return (
        <nav>
            <div className={styles.navbar__right}>
                <Link href={user ? `/dashboard/${user.tipo.toLowerCase()}` : "#"}>
                    <Image src="/logo-transparent-azul.svg" alt="Logo HealthTech" className={styles.navbar__logo} width={150} height={40} />
                </Link>
                <div className={styles.navbar__user}>
                    <div className={styles.navbar__avatar}>
                        {user ? getInitials(user.name) : "??"}
                    </div>
                    <div className={styles["navbar__user-info"]}>
                        <span className={styles["navbar__user-name"]}>
                            {user ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : "Carregando..."}
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
