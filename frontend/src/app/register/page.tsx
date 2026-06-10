'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/services/users.service';
import styles from './register.module.css';

type FormState = { name: string; email: string; password: string };
type Status = 'idle' | 'loading' | 'success' | 'error';

const INITIAL_FORM: FormState = { name: '', email: '', password: '' };

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await registerUser(form);
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao cadastrar. Tente novamente.');
      setStatus('error');
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        <a href="../">
          <img src="/logo-healthtech-vetor.svg" alt="Logo HealthTech" className={styles.logo} />
        </a>        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>Junte-se à plataforma 
          <span className={styles.textHealth}> HealthTech</span>
          </p>
        {status === 'success' && (
          <p className={styles.success}>Cadastro realizado com sucesso!</p>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          
          <div className={styles.chooseTypePerson}>
            <button className={styles.buttonChoose}>Paciente</button>
            <button className={styles.buttonChoose}>Médico</button>
          </div>
          
          <label className={styles.label}>
            Nome completo
            <input
              className={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome e sobrenome"
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

          {status === 'error' && <p className={styles.error}>{errorMsg}</p>}

          <button className={styles.button} type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className={styles.footer}>
          Já tem uma conta? <Link href="/login">Fazer login</Link>
        </p>
      </div>
    </main>
  );
}
