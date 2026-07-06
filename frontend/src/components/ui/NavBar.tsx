"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./NavBar.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function NavBar() {
    // Consumindo a memória global (Context)
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Construção Dinâmica dos Links
    const links = user?.tipo === "MEDICO" 
        ? [
            { label: "Início", href: "/dashboard/medico" },
            { label: "Meus Arquivos", href: "/dashboard/medico/arquivos" },
            { label: "Novo Upload", href: "/dashboard/medico/arquivos/upload"}
          ]
        : [
            { label: "Início", href: "/dashboard/paciente" }
          ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar__container}>
                <div className={styles.navbar__left}>
                    <Link href={user ? `/dashboard/${user.tipo.toLowerCase()}` : "#"}>
                        <Image src="/logo-transparent-azul.svg" alt="Logo HealthTech" className={styles.navbar__logo} width={150} height={40} />
                    </Link>
                    
                    {/* Links Renderizados Dinamicamente (sem o botão hambúrguer aqui) */}
                                        {/* Links Renderizados Dinamicamente e Menu Mobile */}
                    {user && (
                        <div className={`${styles.navbar__links} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
                            {links.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    className={`${styles.navLink} ${pathname === link.href ? styles.activeLink : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* Itens do Usuário EXCLUSIVOS do Mobile (aparecem no fim do menu) */}
                            <div className={styles.mobileUserMenu}>
                                <div className={styles.mobileUserInfo}>
                                    <div className={styles.navbar__avatar}>{getInitials(user.name)}</div>
                                    <div className={styles.mobileUserDetails}>
                                        <span className={styles["navbar__user-name"]}>{user.name}</span>
                                        <span className={styles["navbar__user-role"]}>{user.tipo}</span>
                                    </div>
                                </div>
                                <button className={styles.navbar__logout} onClick={logout}>
                                    <Image src="/logout-icon.svg" alt="Sair" className={styles.logoutIcon} width={18} height={18} />
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}

                </div>
                {/* Botão Hambúrguer Movido para cá! No mobile ele ficará sozinho na direita */}
                <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    ☰
                </button>

                <div className={styles.navbar__right}>
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

                        <button className={styles.navbar__logout} onClick={logout}>
                            <Image src="/logout-icon.svg" alt="Sair icon" className={styles.logoutIcon} width={18} height={18} />
                            <span className={styles.logoutText}>Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
