"use client";

import { useEffect, useState } from "react";
import { getArquivos } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import LoadingState from "@/components/arquivos/LoadingState";
import EmptyState from "@/components/arquivos/EmptyState";
import ErrorState from "@/components/arquivos/ErrorState";
import FilesTable from "@/components/arquivos/FilesTable";
import styles from "@/components/arquivos/ArquivosPage.module.css";

type Status = "loading" | "success" | "error" | "empty";

export default function PacienteArquivosPage() {
  const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchArquivos() {
      setStatus("loading");
      try {
        const data = await getArquivos();
        if (cancelled) return;
        setArquivos(data);
        setStatus(data.length === 0 ? "empty" : "success");
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err instanceof Error ? err.message : "Erro ao carregar arquivos.");
        setStatus("error");
      }
    }
    fetchArquivos();
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState msg={errorMsg} />;
  if (status === "empty") {
    return (
      <EmptyState description="Seus exames e documentos enviados pelo médico aparecerão aqui." />
    );
  }

  return (
    <main>
      <div class="navbar__right">
  <div class="navbar__user">
    <div class="navbar__avatar">BR</div>
    <div class="navbar__user-info">
      <span class="navbar__user-name">Dr. Bruno Silva</span>
      <span class="navbar__user-role">Cardiologia CRM 123456</span>
    </div>
  </div>

  <div class="navbar__divider"></div>

  <button class="navbar__logout">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
    Sair
  </button>
</div>
      

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Meus Arquivos</h1>
            <p className={styles.subtitle}>Seus exames e documentos disponíveis na plataforma</p>
          </div>
          <span className={styles.badge} aria-label="Perfil paciente">Paciente</span>
        </header>

        <div className={`${styles.card} ${styles.fadeIn}`}>
          <FilesTable arquivos={arquivos} viewerRole="paciente" />
        </div>
      </div>
    </main>
  );
}
