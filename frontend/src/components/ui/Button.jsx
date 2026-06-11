import React from 'react';
import styles from './Button.module.css';

/**
 * Componente de Botão Padronizado — HealthTech
 *
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {React.ReactNode} children
 * @param {React.ButtonHTMLAttributes} ...rest
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    fullWidth ? styles['btn--full'] : '',
    loading ? styles['btn--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <span
          className={styles.btn__spinner}
          aria-hidden="true"
          role="status"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
