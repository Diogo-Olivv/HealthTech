import FeedbackMessage from "@/components/ui/FeedbackMessage";
import styles from "./ArquivosPage.module.css";

interface Props {
    msg: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export default function ErrorState({
    msg,
    onRetry,
    retryLabel = "Tentar novamente",
}: Props) {
    return (
        <div className={styles.errorWrapper}>
            <FeedbackMessage
                type="error"
                title="Não foi possível carregar"
                message={msg}
            />
            {onRetry && (
                <div className={styles.errorActions}>
                    <button
                        type="button"
                        className={styles.retryButton}
                        onClick={onRetry}
                    >
                        {retryLabel}
                    </button>
                </div>
            )}
        </div>
    );
}
