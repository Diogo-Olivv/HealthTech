"use client";

import Link from "next/link";
import FileUpload from "@/components/arquivos/FileUpload";
import styles from "@/components/arquivos/ArquivosPage.module.css";

export default function UploadPage() {
  return (
    <main>
      <div className={styles.container}>
        <Link
          href="/dashboard/medico/arquivos"
          className={styles.backLink}
          aria-label="Voltar para a lista de arquivos">
          Voltar
        </Link>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Upload de Arquivos</h1>
            <p className={styles.subtitle}>
              Envie laudos e exames para os seus pacientes vinculados
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <FileUpload />
        </div>
      </div>
    </main>
  );
}
