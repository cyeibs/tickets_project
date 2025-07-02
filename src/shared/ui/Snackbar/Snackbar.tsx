import type { FC, ReactNode } from 'react';
import styles from './Snackbar.module.scss';

export interface SnackbarProps {
  children: ReactNode;
  className?: string;
}

export const Snackbar: FC<SnackbarProps> = ({ children, className = '' }) => {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return <div className={containerClasses}>{children}</div>;
};
