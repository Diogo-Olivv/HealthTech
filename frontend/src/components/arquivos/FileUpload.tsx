"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { uploadArquivo } from "@/services/arquivos.service";
import { getMyPatients } from "@/services/users.service";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto";
import { UPLOAD_ARQUIVO_LIMITES } from "@/dto/upload-arquivo.dto";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import styles from "./FileUpload.module.css";

type Status = "idle" | "loading" | "success" | "error";

const { tamanhoMaximoBytes, formatosPermitidos } = UPLOAD_ARQUIVO_LIMITES;

function mensagemDeErro(erro: unknown, fallback: string): string {
    return erro instanceof Error && erro.message ? erro.message : fallback;
}

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [pacientes, setPacientes] = useState<PacienteVinculadoDto[]>([]);
    const [pacienteId, setPacienteId] = useState<string>("");
    const [buscaPaciente, setBuscaPaciente] = useState<string>("");
    const [dropdownAberto, setDropdownAberto] = useState<boolean>(false);
    const [status, setStatus] = useState<Status>("idle");
    const [feedbackMsg, setFeedbackMsg] = useState<string>("");
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const dropzoneRef = useRef<HTMLInputElement>(null);
    const seletorPacienteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function carregarPacientes() {
            try {
                setPacientes(await getMyPatients());
            } catch (err) {
                setStatus("error");
                setFeedbackMsg(
                    mensagemDeErro(err, "Não foi possível carregar seus pacientes vinculados."),
                );
            }
        }
        carregarPacientes();
    }, []);

    useEffect(() => {
        if (!dropdownAberto) return;
        const handleClickFora = (e: MouseEvent) => {
            if (!seletorPacienteRef.current?.contains(e.target as Node)) {
                setDropdownAberto(false);
            }
        };
        window.addEventListener("mousedown", handleClickFora);
        return () => window.removeEventListener("mousedown", handleClickFora);
    }, [dropdownAberto]);

    const pacienteSelecionado = useMemo(
        () => pacientes.find((p) => p.pacienteId === pacienteId) ?? null,
        [pacientes, pacienteId],
    );

    const pacientesFiltrados = useMemo(() => {
        const termo = buscaPaciente.trim().toLowerCase();
        if (!termo) return pacientes;
        return pacientes.filter(
            (p) =>
                p.nome?.toLowerCase().includes(termo) ||
                p.cpf?.replace(/\D/g, "").includes(termo.replace(/\D/g, "")),
        );
    }, [pacientes, buscaPaciente]);

    const validarEArmazenar = (selecionado: File) => {
        if (!formatosPermitidos.includes(selecionado.type as (typeof formatosPermitidos)[number])) {
            setStatus("error");
            setFeedbackMsg("Formato inválido. Apenas PDF, PNG ou JPG são permitidos.");
            setFile(null);
            return;
        }

        if (selecionado.size > tamanhoMaximoBytes) {
            setStatus("error");
            setFeedbackMsg("O arquivo deve ter no máximo 10 MB.");
            setFile(null);
            return;
        }

        setStatus("idle");
        setFeedbackMsg("");
        setFile(selecionado);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsDragging(false);
        const arquivoSelecionado = e.target.files?.[0];
        if (arquivoSelecionado) validarEArmazenar(arquivoSelecionado);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const arquivoSolto = e.dataTransfer.files?.[0];
        if (arquivoSolto) validarEArmazenar(arquivoSolto);
    };

    const handleDropzoneKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            dropzoneRef.current?.click();
        }
    };

    const selecionarPaciente = (p: PacienteVinculadoDto) => {
        setPacienteId(p.pacienteId);
        setBuscaPaciente("");
        setDropdownAberto(false);
    };

    const limparSelecaoPaciente = () => {
        setPacienteId("");
        setBuscaPaciente("");
        setDropdownAberto(true);
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
            await uploadArquivo({ file, pacienteId });
            setStatus("success");
            setFeedbackMsg("Exame enviado e vinculado com sucesso!");
            setFile(null);
            setPacienteId("");
            setBuscaPaciente("");
        } catch (err) {
            setStatus("error");
            setFeedbackMsg(mensagemDeErro(err, "Erro ao enviar o arquivo."));
        }
    };

    const isEnvioBloqueado = !file || !pacienteId || status === "loading";

    return (
        <div className={styles.uploadContainer}>
            {(status === "error" || status === "success") && (
                <FeedbackMessage type={status} message={feedbackMsg} />
            )}

            <div className={styles.formGroup} ref={seletorPacienteRef}>
                <label className={styles.label} htmlFor="paciente-busca">
                    Paciente Vinculado:
                </label>

                {pacienteSelecionado ? (
                    <div className={styles.pacienteSelecionado}>
                        <span>
                            {pacienteSelecionado.nome} (CPF: {pacienteSelecionado.cpf})
                        </span>
                        <button
                            type="button"
                            onClick={limparSelecaoPaciente}
                            className={styles.limparBtn}
                            aria-label="Trocar paciente selecionado"
                        >
                            Trocar
                        </button>
                    </div>
                ) : (
                    <div className={styles.combobox}>
                        <input
                            id="paciente-busca"
                            type="text"
                            role="combobox"
                            aria-expanded={dropdownAberto}
                            aria-controls="paciente-listbox"
                            autoComplete="off"
                            placeholder="Pesquise por nome ou CPF..."
                            value={buscaPaciente}
                            onFocus={() => setDropdownAberto(true)}
                            onChange={(e) => {
                                setBuscaPaciente(e.target.value);
                                setDropdownAberto(true);
                            }}
                            className={styles.comboboxInput}
                        />
                        {dropdownAberto && (
                            <ul
                                id="paciente-listbox"
                                role="listbox"
                                className={styles.comboboxList}
                            >
                                {pacientesFiltrados.length === 0 ? (
                                    <li className={styles.comboboxEmpty}>
                                        Nenhum paciente encontrado.
                                    </li>
                                ) : (
                                    pacientesFiltrados.map((p) => (
                                        <li
                                            key={p.pacienteId}
                                            role="option"
                                            aria-selected={p.pacienteId === pacienteId}
                                            className={styles.comboboxOption}
                                            onClick={() => selecionarPaciente(p)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    selecionarPaciente(p);
                                                }
                                            }}
                                            tabIndex={0}
                                        >
                                            <strong>{p.nome}</strong>
                                            <small>CPF: {p.cpf}</small>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label
                    className={`${styles.fileInput} ${styles.dropzoneLabel} ${isDragging ? styles.dragging : ""}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={handleDropzoneKeyDown}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                >
                    <input
                        ref={dropzoneRef}
                        type="file"
                        onChange={handleFileChange}
                        className={styles.hiddenInput}
                        accept={formatosPermitidos.join(",")}
                    />
                    <div className={styles.dropzoneText}>
                        <Image
                            src="/upload-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                            aria-hidden="true"
                            className={styles.uploadIcon}
                        />
                        <span>Solte o arquivo aqui ou clique para selecionar</span>

                        <span className={styles.dropzoneSubText}>
                            Formatos permitidos: PDF, PNG, JPG (Máx 10MB)
                        </span>

                        <span className={styles.browseButton}>Procurar Arquivo</span>
                    </div>
                </label>
            </div>

            {file && (
                <p className={styles.fileInfo}>
                    Selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
            )}

            <button
                type="button"
                onClick={handleUpload}
                disabled={isEnvioBloqueado}
                className={styles.uploadButton}
            >
                {status === "loading" ? "Enviando..." : "Upload do Exame"}
            </button>
        </div>
    );
}
