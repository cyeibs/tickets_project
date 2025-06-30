import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './Tab.module.scss';

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export const Tab: FC<TabProps> = ({
  children,
  className = '',
  accent = false,
  disabled = false,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    accent ? styles.accent : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
