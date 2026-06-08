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

const StethoscopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
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

const specialties = [
  'Cardiologia', 'Clínica Geral', 'Dermatologia', 'Endocrinologia',
  'Ginecologia', 'Neurologia', 'Oftalmologia', 'Ortopedia',
  'Pediatria', 'Psiquiatria', 'Urologia', 'Outra',
];

export default function RegisterMedicoPage() {
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    crm: '',
    uf: '',
    especialidade: '',
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
    if (!form.crm.trim()) e.crm = 'CRM é obrigatório.';
    else if (!/^\d{4,7}$/.test(form.crm.replace(/\D/g, ''))) e.crm = 'CRM inválido (apenas números).';
    if (!form.uf) e.uf = 'UF é obrigatória.';
    if (!form.especialidade) e.especialidade = 'Especialidade é obrigatória.';
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
      setFeedback({ type: 'success', title: 'Cadastro enviado!', message: 'Sua conta médica foi enviada para análise. Você receberá um e-mail de confirmação em breve.' });
      setForm({ nome: '', sobrenome: '', email: '', telefone: '', crm: '', uf: '', especialidade: '', password: '', confirmPassword: '' });
    } catch {
      setFeedback({ type: 'error', message: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logo__icon}>
            <HeartPulseIcon />
          </div>
          <span className={styles.logo__text}>HealthTech</span>
        </div>
        <p className={styles['step-label']}>Cadastro de Médico</p>
      </div>

      <div className={styles.card}>
        <div className={styles.card__header}>
          <div className={styles['card__icon-wrapper']}>
            <StethoscopeIcon />
          </div>
          <h1 className={styles.card__title}>Cadastro médico</h1>
          <p className={styles.card__subtitle}>
            Preencha seus dados profissionais. Sua conta passará por verificação antes da ativação.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Formulário de cadastro de médico">
          {feedback && (
            <FeedbackMessage type={feedback.type} title={feedback.title} message={feedback.message} />
          )}

          <p className={styles['section-label']}>Dados pessoais</p>

          <div className={styles.form__row}>
            <Input
              label="Nome"
              name="nome"
              id="medico-nome"
              placeholder="Dr(a). Ana"
              value={form.nome}
              onChange={handleChange}
              error={errors.nome}
              required
              autoComplete="given-name"
            />
            <Input
              label="Sobrenome"
              name="sobrenome"
              id="medico-sobrenome"
              placeholder="Souza"
              value={form.sobrenome}
              onChange={handleChange}
              error={errors.sobrenome}
              required
              autoComplete="family-name"
            />
          </div>

          <div className={styles.form__row}>
            <Input
              label="E-mail profissional"
              type="email"
              name="email"
              id="medico-email"
              placeholder="dr@clinica.com"
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
              id="medico-telefone"
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={handleChange}
              error={errors.telefone}
              leftIcon={<PhoneIcon />}
              autoComplete="tel"
            />
          </div>

          <p className={styles['section-label']}>Dados profissionais</p>

          <div className={styles.form__row}>
            <Input
              label="CRM"
              name="crm"
              id="medico-crm"
              placeholder="000000"
              value={form.crm}
              onChange={handleChange}
              error={errors.crm}
              required
              maxLength={7}
              hint="Apenas o número, sem o estado."
            />
            {/* UF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              <label
                htmlFor="medico-uf"
                style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-gray-700)' }}
              >
                UF do CRM <span style={{ color: 'var(--color-error-500)' }}>*</span>
              </label>
              <select
                id="medico-uf"
                name="uf"
                value={form.uf}
                onChange={handleChange}
                required
                aria-invalid={!!errors.uf}
                style={{
                  width: '100%',
                  padding: '0.6875rem var(--spacing-4)',
                  fontFamily: 'var(--font-main)',
                  fontSize: 'var(--text-sm)',
                  color: form.uf ? 'var(--color-gray-900)' : 'var(--color-gray-400)',
                  background: 'var(--color-white)',
                  border: `1.5px solid ${errors.uf ? 'var(--color-error-500)' : 'var(--color-gray-300)'}`,
                  borderRadius: 'var(--radius-md)',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '2.5rem',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                }}
              >
                <option value="" disabled>UF</option>
                {ufs.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              {errors.uf && (
                <span role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error-600)', fontWeight: 'var(--font-weight-medium)' }}>
                  {errors.uf}
                </span>
              )}
            </div>
          </div>

          {/* Especialidade */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <label
              htmlFor="medico-especialidade"
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-gray-700)' }}
            >
              Especialidade <span style={{ color: 'var(--color-error-500)' }}>*</span>
            </label>
            <select
              id="medico-especialidade"
              name="especialidade"
              value={form.especialidade}
              onChange={handleChange}
              required
              aria-invalid={!!errors.especialidade}
              style={{
                width: '100%',
                padding: '0.6875rem var(--spacing-4)',
                fontFamily: 'var(--font-main)',
                fontSize: 'var(--text-sm)',
                color: form.especialidade ? 'var(--color-gray-900)' : 'var(--color-gray-400)',
                background: 'var(--color-white)',
                border: `1.5px solid ${errors.especialidade ? 'var(--color-error-500)' : 'var(--color-gray-300)'}`,
                borderRadius: 'var(--radius-md)',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '2.5rem',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              }}
            >
              <option value="" disabled>Selecione sua especialidade</option>
              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.especialidade && (
              <span role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error-600)', fontWeight: 'var(--font-weight-medium)' }}>
                {errors.especialidade}
              </span>
            )}
          </div>

          <p className={styles['section-label']}>Segurança</p>

          <Input
            label="Senha"
            type="password"
            name="password"
            id="medico-password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<LockIcon />}
            hint="Use letras, números e símbolos."
            showPasswordToggle
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            id="medico-confirm-password"
            placeholder="Repita sua senha"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<LockIcon />}
            showPasswordToggle
            required
            autoComplete="new-password"
          />

          <FeedbackMessage
            type="info"
            message="Seu cadastro médico será analisado pela equipe HealthTech. Você receberá uma confirmação por e-mail em até 2 dias úteis."
          />

          <div className={styles.form__actions}>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              {loading ? 'Enviando cadastro...' : 'Enviar cadastro médico'}
            </Button>
            <Button type="button" variant="secondary" size="lg" fullWidth disabled={loading}>
              <Link href="/register/paciente" style={{ color: 'inherit', textDecoration: 'none' }}>
                Sou paciente — cadastrar como paciente
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
