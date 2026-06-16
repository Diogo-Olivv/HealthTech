"use client";

import { useEffect, useState } from "react";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import { getArquivosPaciente } from "@/services/arquivos.service";
import type { ArquivoDto } from "@/dto/arquivo.dto";
import styles from "./arquivos.module.css";

type Status = "loading" | "success" | "error" | "empty";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

export default function PacienteArquivosPage() {
  const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchArquivos() {
      setStatus("loading");
      try {
        const data = await getArquivosPaciente();
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

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Meus Arquivos</h1>
            <p className={styles.subtitle}>Seus exames e documentos disponíveis na plataforma</p>
          </div>
          <span className={styles.badge} aria-label="Perfil paciente">Paciente</span>
        </header>

        {status === "loading" && (
          <div className={styles.card}>
            <div className={styles.stateContainer} role="status" aria-live="polite">
              <div className={styles.spinner} aria-hidden="true" />
              <p className={styles.stateText}>Carregando arquivos...</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className={styles.errorWrapper}>
            <FeedbackMessage type="error" message={errorMsg} />
          </div>
        )}

        {status === "empty" && (
          <div className={styles.card}>
            <div className={styles.stateContainer} aria-live="polite">
              <InboxIcon className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>Nenhum arquivo encontrado</p>
              <p className={styles.emptyDesc}>
                Seus exames e documentos enviados pelo médico aparecerão aqui.
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.tableWrapper}>
              <table className={styles.table} aria-label="Lista de arquivos do paciente">
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Data de upload</th>
                    <th scope="col">Enviado por</th>
                  </tr>
                </thead>
                <tbody>
                  {arquivos.map((arquivo) => (
                    <tr key={arquivo.id}>
                      <td>
                        <span className={styles.cellNome}>
                          <FileIcon className={styles.fileIcon} />
                          {arquivo.nome}
                        </span>
                      </td>
                      <td><span className={styles.tipoBadge}>{arquivo.tipo}</span></td>
                      <td className={styles.cellDate}>{formatDate(arquivo.dataUpload)}</td>
                      <td className={styles.cellEnviado}>{arquivo.enviadoPor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}