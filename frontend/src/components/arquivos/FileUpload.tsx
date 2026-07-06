"use client";

import styles from "./FileUpload.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { uploadArquivo } from "@/services/arquivos.service";
import { getMyPatients } from "@/services/users.service";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto";
import FeedbackMessage from "@/components/ui/FeedbackMessage";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [pacientes, setPacientes] = useState<PacienteVinculadoDto[]>([]);
    const [pacienteId, setPacienteId] = useState<string>("");
    
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Carrega a lista de pacientes do médico
    useEffect(() => {
        async function fetchPacientes() {
            try {
                const dados = await getMyPatients();
                setPacientes(dados);
            } catch (err) {
                console.error("Erro ao buscar pacientes pro seletor", err);
            }
        }
        fetchPacientes();
    }, []);

    const processFile = (selectedFile: File) => {
        // Validação de formato
        const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
        if (!allowedTypes.includes(selectedFile.type)) {
            setStatus("error");
            setFeedbackMsg("Formato inválido. Apenas PDF, PNG ou JPG são permitidos.");
            setFile(null);
            return;
        }

        // Validação de 10MB
        if (selectedFile.size > 10 * 1024 * 1024) {
            setStatus("error");
            setFeedbackMsg("O arquivo deve ter no máximo 10 MB.");
            setFile(null);
            return;
        }

        setStatus("idle");
        setFeedbackMsg("");
        setFile(selectedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDragging(false);
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!pacienteId) {
            setStatus("error");
            setFeedbackMsg("Selecione um paciente antes de enviar.");
            return;
        }

        setStatus("loading");
        try {
            await uploadArquivo(file, pacienteId);
            setStatus("success");
            setFeedbackMsg("Exame enviado e vinculado com sucesso!");
            setFile(null);
            setPacienteId("");
        } catch (error: any) {
            setStatus("error");
            setFeedbackMsg(error.message || "Erro ao enviar o arquivo.");
        }
    };

        return (
        <div className={styles.card}>
            {/* Componente visual de erro ou sucesso */}
            {status !== "idle" && status !== "loading" && (
                <FeedbackMessage type={status} message={feedbackMsg} />
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>Paciente Vinculado:</label>
                <select 
                    value={pacienteId} 
                    onChange={(e) => setPacienteId(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Selecione o paciente...</option>
                    {pacientes.map(p => (
                        <option key={p.pacienteId} value={p.pacienteId}>
                            {p.nome} (CPF: {p.cpf})
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label 
                    className={`${styles.fileInput} ${styles.dropzoneLabel} ${isDragging ? styles.dragging : ''}`}
                    onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            console.log("Arquivo capturado via Drop:", e.dataTransfer.files[0]);
                            processFile(e.dataTransfer.files[0]);
                        }
                    }}
                >
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className={styles.hiddenInput}
                    />
                    <div className={styles.dropzoneText}>
                        <Image 
                            src="/upload-icon.svg" 
                            alt="Ícone de Upload" 
                            width={24}
                            height={24} 
                            className={styles.uploadIcon}
                        />
                        <span>Solte o arquivo aqui ou clique para selecionar</span>
                        
                        <span className={styles.dropzoneSubText}>
                            Formatos permitidos: PDF, PNG, JPG (Máx 10MB)
                        </span>

                        {/* Este span tem aparência de botão e abre a galeria no mobile por estar dentro da Label */}
                        <span className={styles.browseButton}>
                            Procurar Arquivo
                        </span>
                    </div>


                </label>

            </div>


            {file && (
                <p className={styles.fileInfo}>
                    Selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
            )}

            <button 
                onClick={handleUpload} 
                disabled={!file || !pacienteId || status === "loading"}
                className={styles.uploadButton}
            >
                {status === "loading" ? "Enviando..." : "Upload do Exame"}
            </button>
        </div>
    );
}
