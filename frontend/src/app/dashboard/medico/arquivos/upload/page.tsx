"use client";

import FileUpload from "@/components/arquivos/FileUpload";
import styles from "@/components/arquivos/ArquivosPage.module.css";

export default function UploadPage() {
    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Upload de Arquivos</h1>
                        <p className={styles.subtitle}>
                            Envie laudos e exames para os seus pacientes
                        </p>
                    </div>
                </div>
                
                <div className={styles.card} style={{ marginTop: "2rem" }}>
                    <FileUpload />
                </div>
            </div>
        </main>
    );
}
