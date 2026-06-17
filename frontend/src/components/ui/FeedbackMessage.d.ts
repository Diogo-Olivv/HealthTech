declare module '@/components/ui/FeedbackMessage' {
  interface FeedbackMessageProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
  }
  const FeedbackMessage: (props: FeedbackMessageProps) => JSX.Element | null;
  export default FeedbackMessage;
}