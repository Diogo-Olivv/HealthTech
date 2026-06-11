import React from 'react';
import styles from './FeedbackMessage.module.css';

/**
 * Componente de Feedback — HealthTech
 *
 * @param {'success' | 'error' | 'warning' | 'info'} type
 * @param {string} message   - Texto principal
 * @param {string} title     - Título opcional
 */
const FeedbackMessage = ({ type = 'info', message, title }) => {
  if (!message) return null;

  const classes = [styles.message, styles[`message--${type}`]].join(' ');

  return (
    <div className={classes} role="alert" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">
        {icons[type]}
      </span>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        <p className={styles.description}>{message}</p>
      </div>
    </div>
  );
};

const icons = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

export default FeedbackMessage;
