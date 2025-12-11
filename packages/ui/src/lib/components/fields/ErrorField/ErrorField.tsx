import styles from './ErrorField.module.css';

interface ErrorFieldProps {
  message: string;
}

export const ErrorField: React.FC<ErrorFieldProps> = ({ message }) => {
  return <p className={styles.error}>{message}</p>;
};
