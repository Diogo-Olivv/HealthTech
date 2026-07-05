import React, { useState, useEffect } from 'react';
import styles from './ModalVinculo.module.css';
import { getAvailablePatients, linkPatient, getToken } from '@/services/users.service';

export interface PacienteDisponivel {
    id: string;
    nome: string;
    cpf: string;
    email: string;
}


interface ModalVinculoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Avisa a tela principal que deu certo!
}


export function ModalVinculo({ isOpen, onClose, onSuccess }: ModalVinculoProps) {

    const [pacientes, setPacientes] = useState<PacienteDisponivel[]>([]);
    const [busca, setBusca] = useState('');
    const [selecionado, setSelecionado] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Quando o modal abrir, busca a lista
    useEffect(() => {
        if (!isOpen) return;
        
        async function fetchPacientes() {
            setLoading(true);
            const token = getToken();
            if (token) {
                try {
                    const dados = await getAvailablePatients(token);
                    setPacientes(dados);
                } catch (error) {
                    console.error("Erro", error);
                }
            }
            setLoading(false);
        }
        fetchPacientes();
    }, [isOpen]);

    // Filtra a lista com base no que foi digitado na pesquisa
    const pacientesFiltrados = pacientes.filter(p => 
        p.nome?.toLowerCase().includes(busca.toLowerCase()) || 
        p.cpf?.includes(busca)
    );

    // Função do botão de confirmar
    const handleConfirmar = async () => {
        if (!selecionado) return alert("Selecione um paciente!");
        
        const token = getToken();
        if (token) {
            try {
                await linkPatient(token, selecionado);
                onSuccess(); 
                onClose(); 
            } catch (error) {
                alert("Erro ao vincular.");
            }
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
                    <button
                        onClick={onClose}
                        className={styles.btnCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmar}
                        className={styles.btnConfirm}>
                        Confirmar Vínculo
                    </button>
                </div>
            </div>
        </div>
    );
}
