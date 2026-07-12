import { useEffect, useState } from "react";
import styles from "./ModalVinculo.module.css";
import { getAvailablePatients, linkPatient } from "@/services/users.service";
import type { PacienteDisponivelDto } from "@/dto/paciente-disponivel.dto";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import CloseButton from "@/components/ui/CloseButton";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import { errorAlert, successAlert } from "@/utils/alerts";
import { formatDate } from "@/utils/date";
import type { ModalVinculoProps } from "@/types/modal-vinculo";

export function ModalVinculo({ isOpen, onClose, onSuccess }: ModalVinculoProps) {
    const [pacientes, setPacientes] = useState<PacienteDisponivelDto[]>([]);
    const [busca, setBusca] = useState("");
    const [selecionado, setSelecionado] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; msg: string } | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setFeedback(null);
            setSelecionado(null);
            setBusca("");
            return;
        }

        async function fetchPacientes() {
            setLoading(true);
            try {
                const dados = await getAvailablePatients();
                setPacientes(dados);
            } catch (error) {
                const msg = mensagemDeErro(
                    error,
                    "Não foi possível carregar a lista de pacientes disponíveis.",
                );
                setFeedback({ type: "error", msg });
                setPacientes([]);
            } finally {
                setLoading(false);
            }
        }
        fetchPacientes();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !confirmando) onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, confirmando, onClose]);

    const pacientesFiltrados = pacientes.filter((p) => {
        const termo = busca.toLowerCase();
        return (
            p.nome?.toLowerCase().includes(termo) ||
            p.email?.toLowerCase().includes(termo)
        );
    });

    const pacienteSelecionado = pacientes.find((p) => p.id === selecionado);

    const handleConfirmar = async () => {
        if (!selecionado) {
            setFeedback({
                type: "error",
                msg: "Selecione um paciente na lista antes de confirmar.",
            });
            return;
        }

        setConfirmando(true);
        try {
            await linkPatient(selecionado);
            const nomePaciente = pacienteSelecionado?.nome ?? "O paciente";
            setConfirmando(false);
            onSuccess();
            onClose();
            await successAlert(
                "Solicitação enviada!",
                `${nomePaciente} precisa aprovar a solicitação antes que você tenha acesso aos exames.`,
                "Continuar",
            );
        } catch (error) {
            const msg = mensagemDeErro(error, "Erro ao solicitar vínculo.");
            setFeedback({ type: "error", msg });
            errorAlert("Não foi possível solicitar o vínculo", msg);
            setConfirmando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-vinculo-title"
            onClick={(e) => {
                if (e.target === e.currentTarget && !confirmando) onClose();
            }}
        >
            <div className={styles.modal}>
                <CloseButton
                    onClick={onClose}
                    className={styles.closeButton}
                    ariaLabel="Fechar modal"
                    disabled={confirmando}
                />

                <h2 id="modal-vinculo-title" className={styles.title}>
                    Solicitar vínculo com paciente
                </h2>

                <div className={styles.content}>
                    <p className={styles.description}>
                        Selecione um paciente para enviar a solicitação. O paciente precisará aprovar antes que você possa acessar os exames dele.
                    </p>

                    {feedback && (
                        <div className={styles.feedbackWrapper}>
                            <FeedbackMessage type={feedback.type} message={feedback.msg} />
                        </div>
                    )}

                    <label htmlFor="modal-vinculo-busca" className="sr-only">
                        Pesquisar por nome ou e-mail
                    </label>
                    <input
                        id="modal-vinculo-busca"
                        type="search"
                        placeholder="Pesquisar por nome ou e-mail..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={styles.searchInput}
                        autoFocus
                    />

                    {loading ? (
                        <p className={styles.loadingText} role="status" aria-live="polite">
                            Carregando pacientes...
                        </p>
                    ) : (
                        <div
                            className={styles.patientList}
                            role="radiogroup"
                            aria-label="Pacientes disponíveis para vínculo"
                        >
                            {pacientesFiltrados.length === 0 ? (
                                <p className={styles.emptyText}>
                                    {busca
                                        ? "Nenhum paciente corresponde à sua busca."
                                        : "Nenhum paciente disponível para vínculo no momento."}
                                </p>
                            ) : (
                                pacientesFiltrados.map((p) => {
                                    const marcado = selecionado === p.id;
                                    return (
                                        <div
                                            key={p.id}
                                            className={`${styles.patientItem} ${marcado ? styles.selected : ""}`}
                                            onClick={() => setSelecionado(p.id)}
                                            role="radio"
                                            aria-checked={marcado}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    setSelecionado(p.id);
                                                }
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="paciente"
                                                value={p.id}
                                                checked={marcado}
                                                onChange={() => setSelecionado(p.id)}
                                                className={styles.radioInput}
                                                tabIndex={-1}
                                            />
                                            <div>
                                                <strong className={styles.patientName}>{p.nome}</strong>
                                                <br />
                                                <small className={styles.patientCpf}>
                                                    Nascimento: {formatDate(p.dataNascimento)} · {p.email}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={onClose}
                        className={styles.btnCancel}
                        disabled={confirmando}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmar}
                        className={styles.btnConfirm}
                        disabled={!selecionado || confirmando}
                        aria-busy={confirmando}
                    >
                        {confirmando ? "Enviando..." : "Enviar solicitação"}
                    </button>
                </div>
            </div>
        </div>
    );
}
