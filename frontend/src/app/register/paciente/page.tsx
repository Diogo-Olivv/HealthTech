"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerPaciente } from "@/services/users.service";
import { isValidCPF, onlyDigits } from "@/utils/cpf";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import {
    validarNomeCompleto,
    validarEmail,
    validarSenha,
    validarConfirmacaoSenha,
    validarDataNascimento,
} from "@/utils/validacao-registro";
import AuthCard from "@/components/ui/AuthCard";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import PasswordField from "@/components/ui/PasswordField";
import type { RegisterPacienteFormState } from "@/types/auth-forms";
import type { AuthStatus } from "@/types/ui-status";
import styles from "../register.module.css";

const INITIAL_FORM: RegisterPacienteFormState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    dataNascimento: "",
};

function validarFormulario(form: RegisterPacienteFormState): string | null {
    return (
        validarNomeCompleto(form.name) ??
        validarEmail(form.email) ??
        validarSenha(form.password) ??
        validarConfirmacaoSenha(form.password, form.confirmPassword) ??
        (isValidCPF(form.cpf) ? null : "CPF inválido.") ??
        validarDataNascimento(form.dataNascimento)
    );
}

export default function RegisterPacientePage() {
    const router = useRouter();
    const [form, setForm] = useState<RegisterPacienteFormState>(INITIAL_FORM);
    const [status, setStatus] = useState<AuthStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const isSubmitting = status === "loading" || status === "success";
    const hoje = useMemo(() => new Date().toISOString().slice(0, 10), []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        const nextValue = name === "cpf" ? onlyDigits(value) : value;
        setForm((prev) => ({ ...prev, [name]: nextValue }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        const erro = validarFormulario(form);
        if (erro) {
            setErrorMsg(erro);
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            await registerPaciente({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                cpf: form.cpf,
                dataNascimento: form.dataNascimento,
            });
            setStatus("success");
            router.push("/login");
        } catch (err) {
            setErrorMsg(mensagemDeErro(err, "Erro ao cadastrar. Tente novamente."));
            setStatus("error");
        }
    }

    return (
        <AuthCard>
            <Link href="/register" className={styles.backLink}>
                ← Voltar
            </Link>

            <h1 className={styles.title}>Cadastro de Paciente</h1>

            <p className={styles.subtitle}>
                Junte-se à plataforma
                <span className={styles.textHealth}> HealthTech</span>
            </p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <label className={styles.label} htmlFor="reg-pac-name">
                    Nome completo
                    <input
                        id="reg-pac-name"
                        className={styles.input}
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nome e Sobrenome"
                        autoComplete="name"
                        autoFocus
                        required
                    />
                </label>

                <label className={styles.label} htmlFor="reg-pac-email">
                    E-mail
                    <input
                        id="reg-pac-email"
                        className={styles.input}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        required
                    />
                </label>

                <div className={styles.passwordCols}>
                    <PasswordField
                        id="reg-pac-password"
                        label="Senha"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={8}
                        labelClassName={styles.label}
                        inputClassName={styles.input}
                        required
                    />

                    <PasswordField
                        id="reg-pac-confirm"
                        label="Confirmar senha"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={8}
                        labelClassName={styles.label}
                        inputClassName={styles.input}
                        required
                    />
                </div>

                <label className={styles.label} htmlFor="reg-pac-cpf">
                    CPF
                    <input
                        id="reg-pac-cpf"
                        className={styles.input}
                        type="text"
                        inputMode="numeric"
                        name="cpf"
                        value={form.cpf}
                        maxLength={11}
                        onChange={handleChange}
                        placeholder="Somente números"
                        autoComplete="off"
                        required
                    />
                </label>

                <label className={styles.label} htmlFor="reg-pac-dt">
                    Data de Nascimento
                    <input
                        id="reg-pac-dt"
                        className={styles.input}
                        type="date"
                        name="dataNascimento"
                        value={form.dataNascimento}
                        onChange={handleChange}
                        max={hoje}
                        autoComplete="bday"
                        required
                    />
                </label>

                <div className={styles.feedbackSlot} aria-live="polite">
                    {status === "error" && errorMsg && (
                        <FeedbackMessage type="error" message={errorMsg} />
                    )}
                    {status === "success" && (
                        <FeedbackMessage
                            type="success"
                            message="Cadastro realizado! Redirecionando para o login..."
                        />
                    )}
                </div>

                <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && (
                        <span className={styles.spinner} aria-hidden="true" />
                    )}
                    {status === "loading" && "Cadastrando..."}
                    {status === "success" && "Redirecionando..."}
                    {status !== "loading" && status !== "success" && "Criar conta"}
                </button>
            </form>

            <p className={styles.footer}>
                Já tem uma conta? <Link href="/login">Fazer login</Link>
            </p>
        </AuthCard>
    );
}
