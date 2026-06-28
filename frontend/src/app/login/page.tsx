'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProfile, loginUser, saveToken } from '@/services/users.service';
import { UserType } from '@/dto/user-type.enum';
import AuthCard from '@/components/ui/AuthCard';
import styles from './login.module.css';

type FormState = { email: string; password: string };
type Status = 'idle' | 'loading' | 'error';

const INITIAL_FORM: FormState = { email: '', password: '' };

export default function LoginPage() {
  const router = useRouter();
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
      const { accessToken } = await loginUser(form);
      saveToken(accessToken);
      const profile = await getProfile(accessToken);
      const destino =
        profile.tipo === UserType.MEDICO
          ? '/dashboard/medico'
          : '/dashboard/paciente';
      router.push(destino);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao entrar. Tente novamente.');
      setStatus('error');
    }
  }

  return (
      <AuthCard>
          <h1 className={styles.title}>Bem-vindo ao
            <span className={styles.textHealth}> Health</span>
            <span className={styles.textTech}>Tech</span>
          </h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar</p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                placeholder="********"
                required
              />
            </label>

            <button className={styles.button} type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className={styles.footer}>
            Ainda não tem conta? <Link href="/register">Cadastre-se</Link>
          </p>
      </AuthCard>
  );
}
