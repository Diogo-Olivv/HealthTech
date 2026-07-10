"use client";

import { useState } from "react";
import styles from "./PasswordField.module.css";

interface PasswordFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    autoComplete?: "current-password" | "new-password";
    minLength?: number;
    required?: boolean;
    inputClassName?: string;
    labelClassName?: string;
    id?: string;
}

export default function PasswordField({
    label,
    name,
    value,
    onChange,
    placeholder = "********",
    autoComplete = "current-password",
    minLength,
    required,
    inputClassName,
    labelClassName,
    id,
}: PasswordFieldProps) {
    const [visivel, setVisivel] = useState(false);
    const inputId = id ?? `pwd-${name}`;

    return (
        <label className={labelClassName} htmlFor={inputId}>
            {label}
            <span className={styles.wrapper}>
                <input
                    id={inputId}
                    className={inputClassName}
                    type={visivel ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    minLength={minLength}
                    required={required}
                />
                <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setVisivel((v) => !v)}
                    aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={visivel}
                    tabIndex={-1}
                >
                    {visivel ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </span>
        </label>
    );
}

function EyeIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}
