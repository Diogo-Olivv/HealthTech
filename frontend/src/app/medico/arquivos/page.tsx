"use client";

import { useEffect, useState } from "react";
import { getArquivosMedico } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import styles from "./page.module.css";
import LoadingState from "./_components/LoadingState";
import EmptyState from "./_components/EmptyState";
import ErrorState from "./_components/ErrorState";
import FilesTable from "./_components/FilesTable";

type Status = "loading" | "success" | "error" | "empty";

export default function MedicoArquivosPage() {
  const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchArquivos() {
      setStatus("loading");
      try {
        const data = await getArquivosMedico();
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

  // Renderização principal
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState msg={errorMsg} />;
  if (status === "empty") return <EmptyState />;

  // Sucesso com arquivos
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Meus Arquivos</h1>
            <p className={styles.subtitle}>Documentos e exames vinculados ao seu perfil</p>
          </div>
          <span className={styles.badge} aria-label="Perfil médico">Médico</span>
        </header>

        <div className={`${styles.card} ${styles.fadeIn}`}>
          <FilesTable arquivos={arquivos} />
        </div>
      </div>
    </main>
  );
}