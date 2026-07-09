"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerMedico } from "@/services/users.service";
import AuthCard from "@/components/ui/AuthCard";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import PasswordField from "@/components/ui/PasswordField";
import SeletorEspecialidades from "@/components/especialidades/SeletorEspecialidades";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import {
    validarNomeCompleto,
    validarEmail,
    validarSenha,
    validarConfirmacaoSenha,
    validarCrm,
    validarEspecialidades,
} from "@/utils/validacao-registro";
import type { RegisterMedicoFormState } from "@/types/auth-forms";
import type { AuthStatus } from "@/types/ui-status";
import styles from "../register.module.css";

const INITIAL_FORM: RegisterMedicoFormState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    crm: "",
    especialidadeIds: [],
};

function validarFormulario(form: RegisterMedicoFormState): string | null {
    return (
        validarNomeCompleto(form.name) ??
        validarEmail(form.email) ??
        validarSenha(form.password) ??
        validarConfirmacaoSenha(form.password, form.confirmPassword) ??
        validarCrm(form.crm) ??
        validarEspecialidades(form.especialidadeIds)
    );
}

export default function RegisterMedicoPage() {
    const router = useRouter();
    const [form, setForm] = useState<RegisterMedicoFormState>(INITIAL_FORM);
    const [status, setStatus] = useState<AuthStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const isSubmitting = status === "loading" || status === "success";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            await registerMedico({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                crm: form.crm.trim(),
                especialidadeIds: form.especialidadeIds,
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

            <h1 className={styles.title}>Cadastro de Médico</h1>
            <p className={styles.subtitle}>
                Junte-se à plataforma
                <span className={styles.textHealth}> HealthTech</span>
            </p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <label className={styles.label} htmlFor="reg-medico-name">
                    Nome completo
                    <input
                        id="reg-medico-name"
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

                <label className={styles.label} htmlFor="reg-medico-email">
                    E-mail
                    <input
                        id="reg-medico-email"
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
                        id="reg-medico-password"
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
                        id="reg-medico-confirm"
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
                <label className={styles.label} htmlFor="reg-medico-crm">
                    CRM
                    <input
                        id="reg-medico-crm"
                        className={styles.input}
                        type="text"
                        name="crm"
                        value={form.crm}
                        onChange={handleChange}
                        placeholder="000000"
                        autoComplete="off"
                        required
                    />
                </label>

                <label className={styles.label} htmlFor="seletor-especialidades">
                    Especialidades (até 5)
                    <SeletorEspecialidades
                        valor={form.especialidadeIds}
                        onChange={(ids) =>
                            setForm((prev) => ({ ...prev, especialidadeIds: ids }))
                        }
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
