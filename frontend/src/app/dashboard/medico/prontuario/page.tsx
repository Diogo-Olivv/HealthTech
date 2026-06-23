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

export default function MedicoArquivosPage() {
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
//   if (status === "empty") {
//     return (
//       <EmptyState description="Quando documentos forem vinculados a este Paciente, eles aparecerão aqui." title="Nenhum documento encontrado" />
//     );
//   }

  return (
    <main>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Exames</h1>
            <p className={styles.subtitle}>Documentos e exames vinculados a este Paciente</p>
          </div>
          <span className={styles.badge} aria-label="Perfil médico">Médico</span>
        </header>

        <div className={`${styles.card} ${styles.fadeIn}`}>
          <FilesTable arquivos={arquivos} viewerRole="medico" />
        </div>

        <div>
            Upload Documento
        </div>
      </div>
    </main>
  );
}
