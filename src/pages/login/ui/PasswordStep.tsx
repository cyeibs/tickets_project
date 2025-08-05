import React from "react";
import { Button, TextField } from "@shared/ui";
import styles from "./LoginPage.module.scss";

interface PasswordStepProps {
  phoneExists: boolean | null;
  password: string;
  confirmPassword: string;
  error: string | null;
  isLoading: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  phoneExists,
  password,
  confirmPassword,
  error,
  isLoading,
  onPasswordChange,
  onConfirmPasswordChange,
  onContinue,
  onBack,
}) => {
  return (
    <>
      <p className={styles.phoneText}>
        {phoneExists ? "Введите пароль" : "Придумайте пароль"}
      </p>

      <div className={styles.passwordContainer}>
        <TextField
          label="Пароль"
          hint={
            phoneExists
              ? undefined
              : "Пароль должен содержать минимум одну заглавную букву, специальный символ и цифру"
          }
          placeholder="Введите пароль"
          value={password}
          onChange={onPasswordChange}
          error={error || undefined}
          type="password"
        />

        <TextField
          label="Повторите пароль"
          placeholder="Введите пароль"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          error={error || undefined}
          type="password"
        />
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onContinue} disabled={isLoading} type="button">
          {isLoading ? "Загрузка..." : "Продолжить"}
        </Button>
        <Button onClick={onBack} type="button">
          Назад
        </Button>
      </div>
    </>
  );
};
