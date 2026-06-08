'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FeedbackMessage from '@/components/ui/FeedbackMessage';
import styles from '../register.module.css';

const HeartPulseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function RegisterPacientePage() {
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.sobrenome.trim()) e.sobrenome = 'Sobrenome é obrigatório.';
    if (!form.email) e.email = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.cpf.trim()) e.cpf = 'CPF é obrigatório.';
    else if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(form.cpf)) e.cpf = 'CPF inválido.';
    if (!form.dataNascimento) e.dataNascimento = 'Data de nascimento é obrigatória.';
    if (!form.password) e.password = 'Senha é obrigatória.';
    else if (form.password.length < 8) e.password = 'A senha deve ter ao menos 8 caracteres.';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'As senhas não coincidem.';
    return e;
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
      // TODO: chamar API real
      await new Promise((res) => setTimeout(res, 2000));
      setFeedback({ type: 'success', title: 'Cadastro realizado!', message: 'Sua conta foi criada com sucesso. Redirecionando para o login...' });
      setForm({ nome: '', sobrenome: '', email: '', telefone: '', cpf: '', dataNascimento: '', password: '', confirmPassword: '' });
    } catch {
      setFeedback({ type: 'error', message: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logo__icon}>
            <HeartPulseIcon />
          </div>
          <span className={styles.logo__text}>HealthTech</span>
        </div>
        <p className={styles['step-label']}>Cadastro de Paciente</p>
      </div>

      <div className={styles.card}>
        <div className={styles.card__header}>
          <div className={styles['card__icon-wrapper']}>
            <UserIcon />
          </div>
          <h1 className={styles.card__title}>Crie sua conta</h1>
          <p className={styles.card__subtitle}>
            Preencha seus dados para se cadastrar como paciente na plataforma.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Formulário de cadastro de paciente">
          {feedback && (
            <FeedbackMessage type={feedback.type} title={feedback.title} message={feedback.message} />
          )}

          <p className={styles['section-label']}>Dados pessoais</p>

          <div className={styles.form__row}>
            <Input
              label="Nome"
              name="nome"
              id="paciente-nome"
              placeholder="João"
              value={form.nome}
              onChange={handleChange}
              error={errors.nome}
              required
              autoComplete="given-name"
            />
            <Input
              label="Sobrenome"
              name="sobrenome"
              id="paciente-sobrenome"
              placeholder="Silva"
              value={form.sobrenome}
              onChange={handleChange}
              error={errors.sobrenome}
              required
              autoComplete="family-name"
            />
          </div>

          <div className={styles.form__row}>
            <Input
              label="CPF"
              name="cpf"
              id="paciente-cpf"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={handleChange}
              error={errors.cpf}
              required
              autoComplete="off"
              maxLength={14}
            />
            <Input
              label="Data de nascimento"
              type="date"
              name="dataNascimento"
              id="paciente-nascimento"
              value={form.dataNascimento}
              onChange={handleChange}
              error={errors.dataNascimento}
              required
              autoComplete="bday"
            />
          </div>

          <div className={styles.form__row}>
            <Input
              label="E-mail"
              type="email"
              name="email"
              id="paciente-email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<MailIcon />}
              required
              autoComplete="email"
            />
            <Input
              label="Telefone"
              type="tel"
              name="telefone"
              id="paciente-telefone"
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={handleChange}
              error={errors.telefone}
              leftIcon={<PhoneIcon />}
              autoComplete="tel"
            />
          </div>

          <p className={styles['section-label']}>Segurança</p>

          <Input
            label="Senha"
            type="password"
            name="password"
            id="paciente-password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<LockIcon />}
            hint="Use letras, números e símbolos para uma senha mais segura."
            showPasswordToggle
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            id="paciente-confirm-password"
            placeholder="Repita sua senha"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<LockIcon />}
            showPasswordToggle
            required
            autoComplete="new-password"
          />

          <div className={styles.form__actions}>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              {loading ? 'Criando conta...' : 'Criar conta de paciente'}
            </Button>
            <Button type="button" variant="secondary" size="lg" fullWidth disabled={loading}>
              <Link href="/register/medico" style={{ color: 'inherit', textDecoration: 'none' }}>
                Sou médico — cadastrar como médico
              </Link>
            </Button>
          </div>
        </form>

        <p className={styles['login-link']}>
          Já tem uma conta? <Link href="/login">Faça login</Link>
        </p>
      </div>
    </main>
  );
}
