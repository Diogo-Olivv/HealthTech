"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerPaciente } from "@/services/users.service";
import styles from "../register.module.css";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  dataNascimento: string;
};
type Status = "idle" | "loading" | "error";

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  cpf: "",
  dataNascimento: "",
};

export default function RegisterPacientePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await registerPaciente({
        name: form.name,
        email: form.email,
        password: form.password,
        cpf: form.cpf,
        dataNascimento: form.dataNascimento,
      });
      router.push("/login");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erro ao cadastrar. Tente novamente.",
      );
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Link href="/register" className={styles.backLink}>
          ← Voltar
        </Link>

        <img
          src="/logo-healthtech-vetor.svg"
          alt="Logo HealthTech"
          className={styles.logo}
        />

        <h1 className={styles.title}>Cadastro de Paciente</h1>

        <p className={styles.subtitle}>
          Junte-se à plataforma
          <span className={styles.textHealth}> HealthTech</span>
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label className={styles.label}>
            Nome completo
            <input
              className={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome e Sobrenome"
              required
            />
          </label>

          <label className={styles.label}>
            E-mail
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </label>

          <div className={styles.passwordCols}>
            <label className={styles.label}>
              Senha
              <input
                className={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                placeholder="********"
                required
              />
            </label>

            <label className={styles.label}>
              Confirmar senha
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength={8}
                placeholder="********"
                required
              />
            </label>
          </div>

          <label className={styles.label}>
            CPF
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              name="cpf"
              value={form.cpf}
              maxLength={11}
              onChange={handleChange}
              placeholder="00000000000"
              required
            />
          </label>

          <label className={styles.label}>
            Data de Nascimento
            <input
              className={styles.input}
              type="date"
              name="dataNascimento"
              value={form.dataNascimento}
              onChange={handleChange}
              required
            />
          </label>

          {status === "error" && <p className={styles.error}>{errorMsg}</p>}

          <button
            className={styles.button}
            type="submit"
            disabled={status === "loading"}>
            {status === "loading" ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className={styles.footer}>
          Já tem uma conta? <Link href="/login">Fazer login</Link>
        </p>
      </div>
    </main>
  );
}
