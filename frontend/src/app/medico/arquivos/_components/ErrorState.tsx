import FeedbackMessage from '@/components/ui/FeedbackMessage';
import styles from '../page.module.css';

interface Props {
  msg: string;
}

export default function ErrorState({ msg }: Props) {
  return (
    <div className={styles.errorWrapper}>
      <FeedbackMessage type="error" message={msg} />
    </div>
  );
}