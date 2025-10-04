import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export const Button: FC<ButtonProps> = ({
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
