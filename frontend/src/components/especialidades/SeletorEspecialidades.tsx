"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { EspecialidadeDto } from "@/dto/especialidade.dto";
import { listarEspecialidades } from "@/services/especialidades.service";
import CloseButton from "@/components/ui/CloseButton";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import type { SeletorEspecialidadesProps } from "@/types/seletor-especialidades";
import styles from "./SeletorEspecialidades.module.css";

export default function SeletorEspecialidades({
    valor,
    onChange,
    max = 5,
    opcoes,
    id = "seletor-especialidades",
}: SeletorEspecialidadesProps) {
    const [todas, setTodas] = useState<EspecialidadeDto[]>(opcoes ?? []);
    const [carregando, setCarregando] = useState<boolean>(!opcoes);
    const [erroFetch, setErroFetch] = useState<string>("");
    const [busca, setBusca] = useState<string>("");
    const [dropdownAberto, setDropdownAberto] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (opcoes) {
            setTodas(opcoes);
            return;
        }
        (async () => {
            try {
                setTodas(await listarEspecialidades());
            } catch (err) {
                setErroFetch(mensagemDeErro(err, "Erro ao carregar especialidades."));
            } finally {
                setCarregando(false);
            }
        })();
    }, [opcoes]);

    useEffect(() => {
        if (!dropdownAberto) return;
        const handle = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                setDropdownAberto(false);
            }
        };
        window.addEventListener("mousedown", handle);
        return () => window.removeEventListener("mousedown", handle);
    }, [dropdownAberto]);

    const selecionadas = useMemo(
        () => todas.filter((e) => valor.includes(e.id)),
        [todas, valor],
    );

    const filtradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return todas
            .filter((e) => !valor.includes(e.id))
            .filter((e) => (termo ? e.nome.toLowerCase().includes(termo) : true));
    }, [todas, valor, busca]);

    const noLimite = valor.length >= max;

    const adicionar = (id: string) => {
        if (noLimite || valor.includes(id)) return;
        onChange([...valor, id]);
        setBusca("");
    };

    const remover = (id: string) => {
        onChange(valor.filter((v) => v !== id));
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !busca && valor.length > 0) {
            onChange(valor.slice(0, -1));
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (filtradas.length > 0) adicionar(filtradas[0].id);
        }
        if (e.key === "Escape") setDropdownAberto(false);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <div
                className={styles.chipsBox}
                role="group"
                aria-label="Especialidades selecionadas"
                onClick={() => inputRef.current?.focus()}
            >
                {selecionadas.map((esp) => (
                    <span key={esp.id} className={styles.chip}>
                        {esp.nome}
                        <CloseButton
                            className={styles.chipRemove}
                            onClick={() => remover(esp.id)}
                            ariaLabel={`Remover ${esp.nome}`}
                        />
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    role="combobox"
                    aria-expanded={dropdownAberto}
                    aria-controls={`${id}-listbox`}
                    autoComplete="off"
                    className={styles.input}
                    placeholder={
                        noLimite
                            ? `Máximo de ${max} atingido`
                            : selecionadas.length === 0
                              ? "Digite para pesquisar (ex.: cardiologia)"
                              : ""
                    }
                    value={busca}
                    disabled={noLimite && !busca}
                    onFocus={() => setDropdownAberto(true)}
                    onChange={(e) => {
                        setBusca(e.target.value);
                        setDropdownAberto(true);
                    }}
                    onKeyDown={handleKey}
                />
            </div>

            <div className={styles.dropdown}>
                {dropdownAberto && (
                    <ul
                        id={`${id}-listbox`}
                        role="listbox"
                        aria-multiselectable="true"
                        className={styles.dropdownList}
                    >
                        {carregando && <li className={styles.emptyOption}>Carregando...</li>}
                        {!carregando && erroFetch && (
                            <li className={styles.emptyOption}>{erroFetch}</li>
                        )}
                        {!carregando && !erroFetch && filtradas.length === 0 && (
                            <li className={styles.emptyOption}>
                                Nenhuma especialidade encontrada.
                            </li>
                        )}
                        {!carregando &&
                            !erroFetch &&
                            filtradas.map((esp) => (
                                <li
                                    key={esp.id}
                                    role="option"
                                    aria-selected={false}
                                    className={`${styles.option} ${
                                        noLimite ? styles.optionDisabled : ""
                                    }`}
                                    onClick={() => adicionar(esp.id)}
                                >
                                    {esp.nome}
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            <span className={styles.hint}>
                {valor.length}/{max} selecionadas
            </span>
        </div>
    );
}
