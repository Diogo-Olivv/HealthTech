'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FeedbackMessage from '@/components/ui/FeedbackMessage';
import styles from './login.module.css';

// Ícones SVG inline
const HeartPulseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    if (!form.password) {
      newErrors.password = 'A senha é obrigatória.';
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter ao menos 6 caracteres.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // TODO: substituir pela chamada real à API
      await new Promise((res) => setTimeout(res, 1800));
      setFeedback({ type: 'success', message: 'Login realizado com sucesso! Redirecionando...' });
    } catch {
      setFeedback({ type: 'error', message: 'E-mail ou senha inválidos. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* Painel Hero (desktop) */}
      <aside className={styles.hero} aria-hidden="true">
        <div className={styles.hero__logo}>
          <div className={styles.hero__logo__icon}>
            <HeartPulseIcon />
          </div>
          <span className={styles['hero__logo-text']}>HealthTech</span>
        </div>

        <div className={styles.hero__content}>
          <h1 className={styles.hero__title}>
            Cuidado de saúde<br />inteligente e conectado
          </h1>
          <p className={styles.hero__subtitle}>
            Gerencie consultas, pacientes e prontuários em uma plataforma segura, moderna e eficiente.
          </p>
        </div>

        <ul className={styles.hero__features}>
          {[
            { icon: <ShieldIcon />, text: 'Dados protegidos com criptografia de ponta' },
            { icon: <UsersIcon />, text: 'Gestão completa de pacientes e médicos' },
            { icon: <CalendarIcon />, text: 'Agendamentos e histórico integrados' },
          ].map((item, i) => (
            <li key={i} className={styles.hero__feature}>
              <span className={styles['hero__feature-icon']}>{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Painel do formulário */}
      <section className={styles['form-panel']}>
        <div className={styles['form-container']}>
          {/* Logo mobile */}
          <div className={styles['mobile-logo']}>
            <div className={styles['mobile-logo__icon']}>
              <HeartPulseIcon />
            </div>
            <span className={styles['mobile-logo__text']}>HealthTech</span>
          </div>

          <div className={styles['form-header']}>
            <h2 className={styles['form-title']}>Bem-vindo de volta</h2>
            <p className={styles['form-subtitle']}>
              Entre com suas credenciais para acessar a plataforma.
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulário de login"
          >
            {feedback && (
              <FeedbackMessage type={feedback.type} message={feedback.message} />
            )}

            <Input
              label="E-mail"
              type="email"
              name="email"
              id="login-email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<MailIcon />}
              required
              autoComplete="email"
            />

            <div>
              <Input
                label="Senha"
                type="password"
                name="password"
                id="login-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<LockIcon />}
                showPasswordToggle
                required
                autoComplete="current-password"
              />
              <div className={styles['forgot-link']}>
                <Link href="/forgot-password">Esqueceu a senha?</Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              aria-label="Entrar na plataforma"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className={styles['form-footer']}>
            <p className={styles['form-footer__text']}>
              Ainda não tem uma conta?{' '}
              <Link href="/register/paciente" className={styles['form-footer__link']}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
