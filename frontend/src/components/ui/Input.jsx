import React, { useState, useId } from 'react';
import styles from './Input.module.css';

/**
 * Componente de Input Padronizado — HealthTech
 *
 * @param {string} label
 * @param {string} error - Mensagem de erro
 * @param {string} hint  - Texto auxiliar
 * @param {boolean} required
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 * @param {boolean} showPasswordToggle - Para inputs de senha
 * @param {React.InputHTMLAttributes} ...rest
 */
const Input = ({
  label,
  error,
  hint,
  required = false,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  id: externalId,
  ...rest
}) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === 'password' && showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  const inputClasses = [
    styles.input,
    leftIcon ? styles['input--with-left-icon'] : '',
    rightIcon || showPasswordToggle ? styles['input--with-right-icon'] : '',
    error ? styles['input--error'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const describedBy = [error ? errorId : '', hint ? hintId : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={id}
          className={[styles.label, required ? styles['label--required'] : ''].join(' ')}
        >
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        {leftIcon && (
          <span className={`${styles.icon} ${styles['icon--left']}`} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={inputClasses}
          {...rest}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className={`${styles.icon} ${styles['icon--right']}`}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}

        {!showPasswordToggle && rightIcon && (
          <span className={`${styles.icon} ${styles['icon--right']}`} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles['error-text']} role="alert">
          <AlertIcon />
          {error}
        </span>
      )}

      {hint && !error && (
        <span id={hintId} className={styles['hint-text']}>
          {hint}
        </span>
      )}
    </div>
  );
};

/* ---- Ícones inline SVG pequenos ---- */

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default Input;
