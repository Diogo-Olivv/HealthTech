import type { CloseButtonProps } from "@/types/close-button";
import styles from "./CloseButton.module.css";

export default function CloseButton({
    onClick,
    ariaLabel,
    className,
    title,
    disabled = false,
}: CloseButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.closeButton} ${className ?? ""}`}
            aria-label={ariaLabel}
            title={title}
            disabled={disabled}
        >
            <span className={styles.symbol} aria-hidden="true">
                ×
            </span>
        </button>
    );
}
