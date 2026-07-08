import React, { useState, useEffect } from 'react';
import styles from './ModalVinculo.module.css';
import { getAvailablePatients, linkPatient } from '@/services/users.service';
import type { PacienteDisponivelDto } from "@/dto/paciente-disponivel.dto";
import FeedbackMessage from "@/components/ui/FeedbackMessage";

interface ModalVinculoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ModalVinculo({ isOpen, onClose, onSuccess }: ModalVinculoProps) {
    const [pacientes, setPacientes] = useState<PacienteDisponivelDto[]>([]);
    const [busca, setBusca] = useState('');
    const [selecionado, setSelecionado] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Estado do Feedback (Substitui os Alerts feios)
    const [feedback, setFeedback] = useState<{type: "error" | "success", msg: string} | null>(null);

    // Quando o modal abrir, busca a lista
    useEffect(() => {
        if (!isOpen) {
            // Limpa os dados de estados anteriores toda vez que fecha
            setFeedback(null);
            setSelecionado(null);
            setBusca('');
            return;
        }
        
        async function fetchPacientes() {
            setLoading(true);
            try {
                const dados = await getAvailablePatients();
                setPacientes(dados);
            } catch (error) {
                const msg =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar a lista de pacientes disponíveis.";
                setFeedback({ type: "error", msg });
                setPacientes([]);
            } finally {
                setLoading(false);
            }
        }
        fetchPacientes();
    }, [isOpen]);

    const pacientesFiltrados = pacientes.filter(p => 
        p.nome?.toLowerCase().includes(busca.toLowerCase()) || 
        p.cpf?.includes(busca)
    );

    const handleConfirmar = async () => {
        if (!selecionado) {
            setFeedback({ type: "error", msg: "Selecione um paciente na lista antes de confirmar." });
            return;
        }
        
        try {
            await linkPatient(selecionado);
            setFeedback({ type: "success", msg: "Paciente vinculado com sucesso!" });
            
            // Dá 1.5s de tempo para o usuário ler a mensagem de sucesso antes do Modal fechar sozinho
            setTimeout(() => {
                onSuccess(); 
                onClose(); 
            }, 1500);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erro ao vincular paciente.";
            setFeedback({ type: "error", msg });
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="Fechar modal"
                >
                    &times;
                </button>

                {/* Cabeçalho */}
                <h2 className={styles.title}>
                    Vincular Paciente
                </h2>

                {/* Conteúdo */}
                <div className={styles.content}>
                    <p className={styles.description}>
                        Selecione os pacientes para se vincular e ter acesso a seus exames.
                    </p>

                    {feedback && (
                        <div className={styles.feedbackWrapper}>
                            <FeedbackMessage type={feedback.type} message={feedback.msg} />
                        </div>
                    )}

                    {/* Barra de Pesquisa */}
                    <input 
                        type="text" 
                        placeholder="Pesquisar por nome ou CPF..." 
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={styles.searchInput}
                    />

                    {/* Lista de Pacientes */}
                    {loading ? (
                        <p className={styles.loadingText}>Carregando pacientes...</p>
                    ) : (
                        <div className={styles.patientList}>
                            {pacientesFiltrados.length === 0 ? (
                                <p className={styles.emptyText}>Nenhum paciente disponível encontrado.</p>
                            ) : (
                                pacientesFiltrados.map(p => (
                                    <div 
                                        key={p.id} 
                                        className={`${styles.patientItem} ${selecionado === p.id ? styles.selected : ''}`}
                                        onClick={() => setSelecionado(p.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setSelecionado(p.id);
                                            }
                                        }}
                                    >

                                        <input 
                                            type="radio" 
                                            name="paciente" 
                                            value={p.id} 
                                            checked={selecionado === p.id}
                                            onChange={() => setSelecionado(p.id)}
                                            className={styles.radioInput}
                                        />
                                        <div>
                                            <strong className={styles.patientName}>{p.nome}</strong> <br/>
                                            <small className={styles.patientCpf}>CPF: {p.cpf}</small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>

                {/* Rodapé com Ações */}
                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.btnCancel}>
                        Cancelar
                    </button>
                    <button onClick={handleConfirmar} className={styles.btnConfirm}>
                        Confirmar Vínculo
                    </button>
                </div>
            </div>
        </div>
    );
}
