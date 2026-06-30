import React from 'react';
import styles from './ModalVinculo.module.css';

interface ModalVinculoProps {
    isOpen: boolean;
    onClose: () => void;
    // Adicione outras props necessárias aqui (ex: id do item, dados para vincular, etc)
}

export function ModalVinculo({ isOpen, onClose }: ModalVinculoProps) {
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
                        Aqui você pode adicionar a interface para seleção e vínculo de pacientes.
                    </p>

                    {/* Filtros de Pesquisa */}
                    {/* Tabela com nome e CPF dos pacientes */}

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
                        className={styles.btnConfirm}>
                        Confirmar Vínculo
                    </button>
                </div>
            </div>
        </div>
    );
}
