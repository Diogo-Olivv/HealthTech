import React from 'react';
import styles from './Button.module.css';

/**
 * Componente de Botão Padronizado — HealthTech
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} [props.variant]
 * @param {'sm' | 'md' | 'lg'} [props.size]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 * @param {React.MouseEventHandler<HTMLButtonElement>} [props.onClick]
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
