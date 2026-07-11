"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfile, loginUser, saveToken } from "@/services/users.service";
import { UserType } from "@/dto/user-type.enum";
import AuthCard from "@/components/ui/AuthCard";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import PasswordField from "@/components/ui/PasswordField";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import { successAlert } from "@/utils/alerts";
import type { LoginFormState } from "@/types/auth-forms";
import type { AuthStatus } from "@/types/ui-status";
import styles from "./login.module.css";

const INITIAL_FORM: LoginFormState = { email: "", password: "" };

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState<LoginFormState>(INITIAL_FORM);
    const [status, setStatus] = useState<AuthStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const isSubmitting = status === "loading" || status === "success";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const { accessToken } = await loginUser(form);
            saveToken(accessToken);
            const profile = await getProfile();
            const destino =
                profile.tipo === UserType.MEDICO
                    ? "/dashboard/medico"
                    : "/dashboard/paciente";

            setStatus("success");
            await successAlert(
                "Login realizado com sucesso!",
                `Olá, ${profile.name?.split(" ")[0] ?? "usuário"}. Clique em continuar para acessar seu painel.`,
                "Continuar",
            );
            router.push(destino);
        } catch (err) {
            setErrorMsg(
                mensagemDeErro(err, "Verifique seu e-mail e senha e tente novamente."),
            );
            setStatus("error");
        }
    }

    return (
        <AuthCard>
            <h1 className={styles.title}>
                Bem-vindo ao
                <span className={styles.textHealth}> Health</span>
                <span className={styles.textTech}>Tech</span>
            </h1>
            <p className={styles.subtitle}>Acesse sua conta para continuar</p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <label className={styles.label} htmlFor="login-email">
                    E-mail
                    <input
                        id="login-email"
                        className={styles.input}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        autoFocus
                        aria-invalid={status === "error"}
                        required
                    />
                </label>

                <PasswordField
                    id="login-password"
                    label="Senha"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    labelClassName={styles.label}
                    inputClassName={styles.input}
                    required
                />

                <div className={styles.feedbackSlot} aria-live="polite">
                    {status === "error" && errorMsg && (
                        <FeedbackMessage type="error" message={errorMsg} />
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
                    {status === "loading" && "Entrando..."}
                    {status === "success" && "Redirecionando..."}
                    {status !== "loading" && status !== "success" && "Entrar"}
                </button>
            </form>

            <p className={styles.footer}>
                Ainda não tem conta? <Link href="/register">Cadastre-se</Link>
            </p>
        </AuthCard>
    );
}
