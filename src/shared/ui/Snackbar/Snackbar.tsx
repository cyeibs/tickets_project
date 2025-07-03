import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './Snackbar.module.scss';

export interface SnackbarProps {
  children: ReactNode;
  className?: string;
}

export const Snackbar: FC<SnackbarProps> = ({ children, className = '' }) => {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={containerClasses}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};
