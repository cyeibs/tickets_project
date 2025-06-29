import React from 'react';
import { Button, TextField } from '@shared/ui';
import styles from './LoginPage.module.scss';

interface PasswordStepProps {
  phoneExists: boolean | null;
  password: string;
  error: string | null;
  isLoading: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  phoneExists,
  password,
  error,
  isLoading,
  onPasswordChange,
  onContinue,
  onBack,
}) => {
  return (
    <>
      <p className={styles.phoneText}>
        {phoneExists ? 'Введите пароль' : 'Придумайте пароль'}
      </p>
      <TextField
        label="Пароль"
        hint={
          phoneExists
            ? undefined
            : 'Пароль должен содержать минимум одну заглавную букву, специальный символ и цифру'
        }
        placeholder="Введите пароль"
        value={password}
        onChange={onPasswordChange}
        error={error || undefined}
        type="password"
      />
      <div className={styles.buttonGroup}>
        <Button onClick={onContinue} disabled={isLoading} type="button">
          {isLoading ? 'Загрузка...' : 'Продолжить'}
        </Button>
        <Button onClick={onBack} type="button">
          Назад
        </Button>
      </div>
    </>
  );
};
