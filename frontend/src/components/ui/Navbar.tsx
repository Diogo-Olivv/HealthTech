"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/dto/user-type.enum";
import type { PublicUser } from "@/dto/public-user";
import LogoutIcon from "@/components/icons/LogoutIcon";
import { confirmAlert } from "@/utils/alerts";
import styles from "./Navbar.module.css";

type NavLinkItem = { label: string; href: string };

const LINKS_POR_TIPO: Record<UserType, NavLinkItem[]> = {
  [UserType.MEDICO]: [
    { label: "Meus Pacientes", href: "/dashboard/medico" },
    { label: "Arquivos", href: "/dashboard/medico/arquivos" },
    { label: "Solicitações", href: "/dashboard/medico/solicitacoes" },
  ],
  [UserType.PACIENTE]: [
    { label: "Meus Arquivos", href: "/dashboard/paciente" },
    { label: "Meus Médicos", href: "/dashboard/paciente/medicos" },
    { label: "Solicitações", href: "/dashboard/paciente/solicitacoes" },
  ],
};

const ROTULO_TIPO: Record<UserType, string> = {
  [UserType.MEDICO]: "Médico",
  [UserType.PACIENTE]: "Paciente",
};

function capitalizarNome(nome: string) {
  return nome
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface UserBlockProps {
  user: PublicUser;
  onLogout: () => void;
  layout: "desktop" | "mobile";
}

function UserBlock({ user, onLogout, layout }: UserBlockProps) {
  const wrapperClass =
    layout === "desktop" ? styles.userBlockDesktop : styles.userBlockMobile;
  const nome = layout === "desktop" ? capitalizarNome(user.name) : user.name;

  return (
    <div className={wrapperClass}>
      <div className={styles.userSummary}>
        <div className={styles.avatar}>{getInitials(user.name)}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{nome}</span>
          <span className={styles.userBadge}>{ROTULO_TIPO[user.tipo]}</span>
        </div>
      </div>

      {layout === "desktop" && <div className={styles.divider} />}

      <button type="button" className={styles.logoutBtn} onClick={onLogout}>
        <LogoutIcon className={styles.logoutIcon} />
        <span className={styles.logoutText}>Sair</span>
      </button>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirmado = await confirmAlert({
      icon: "question",
      title: "Deseja sair da sua conta?",
      text: "Você precisará entrar novamente para acessar o painel.",
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
    });
    if (confirmado) logout();
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);

  const links = user ? (LINKS_POR_TIPO[user.tipo] ?? []) : [];
  const homeHref = user ? `/dashboard/${user.tipo.toLowerCase()}` : "/";

  return (
    <nav className={styles.navbar} aria-label="Navegação principal">
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href={homeHref} aria-label="Ir para a página inicial do perfil">
            <Image
              src="/logo-transparent-azul.svg"
              alt="HealthTech"
              className={styles.logo}
              width={150}
              height={40}
              priority
            />
          </Link>

          {user && (
            <div
              id="navbar-menu"
              className={`${styles.links} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                );
              })}

              <div className={styles.mobileOnly}>
                <UserBlock user={user} onLogout={handleLogout} layout="mobile" />
              </div>
            </div>
          )}
        </div>

        {user && (
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="navbar-menu">
            <span aria-hidden="true">☰</span>
          </button>
        )}

        <div className={styles.right}>
          {user && <UserBlock user={user} onLogout={handleLogout} layout="desktop" />}
        </div>
      </div>
    </nav>
  );
}
