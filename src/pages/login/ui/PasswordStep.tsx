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
  const isRegistration = phoneExists === false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordLengthValid = password.length >= 8;
  const isPasswordFormatValid =
    hasUppercase && hasDigit && hasSpecial && isPasswordLengthValid;

  const showPasswordFormatError =
    isRegistration && password.length > 0 && !isPasswordFormatValid;

  const passwordError = showPasswordFormatError
    ? "Пароль должен быть не менее 8 символов и содержать минимум одну заглавную букву, специальный символ и цифру"
    : error || undefined;

  const confirmError =
    isRegistration && confirmPassword.length > 0 && confirmPassword !== password
      ? "Пароли не совпадают"
      : error || undefined;
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
          onChange={(e) =>
            onPasswordChange(e as React.ChangeEvent<HTMLInputElement>)
          }
          error={passwordError}
          type="password"
        />

        <TextField
          label="Повторите пароль"
          placeholder="Введите пароль"
          value={confirmPassword}
          onChange={(e) =>
            onConfirmPasswordChange(e as React.ChangeEvent<HTMLInputElement>)
          }
          error={confirmError}
          type="password"
        />
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onContinue} disabled={isLoading} type="button">
          {isLoading ? "Загрузка..." : "Продолжить"}
        </Button>
        <Button
          onClick={() => {
            onBack();
            onPasswordChange({
              target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>);
            onConfirmPasswordChange({
              target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          type="button"
        >
          Назад
        </Button>
      </div>
    </>
  );
};
