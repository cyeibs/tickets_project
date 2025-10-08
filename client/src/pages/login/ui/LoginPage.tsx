import { useAuth } from "@features/auth";
import { Header } from "@shared/ui";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { PhoneStep } from "./PhoneStep";
import { PasswordStep } from "./PasswordStep";
import { NameStep } from "./NameStep";
import { Logo } from "@/shared/assets/icons";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkPhone, login, register } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneExists, setPhoneExists] = useState<boolean | null>(null);
  const [step, setStep] = useState<"phone" | "password" | "name">("phone");

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    // Reset state when phone changes
    setPhoneExists(null);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const handleFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFirstName((e.target as HTMLInputElement).value);
    setError(null);
  };

  const handleLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLastName((e.target as HTMLInputElement).value);
    setError(null);
  };

  const handleMiddleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMiddleName((e.target as HTMLInputElement).value);
    setError(null);
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };

  const handleCheckPhone = async () => {
    if (!phone || phone.length < 10) {
      setError("Пожалуйста, введите корректный номер телефона");
      return;
    }

    try {
      setIsLoading(true);

      const { exists } = await checkPhone(phone);
      setPhoneExists(exists);
      setIsLoading(false);
      setStep("password");
    } catch (err) {
      setError("Произошла ошибка. Пожалуйста, попробуйте снова.");
      setIsLoading(false);
    }
  };

  const handlePasswordContinue = async () => {
    if (!password) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    if (phoneExists === false) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      const isPasswordLengthValid = password.length >= 8;
      const isPasswordFormatValid =
        hasUppercase && hasDigit && hasSpecial && isPasswordLengthValid;

      if (!isPasswordFormatValid) {
        setError(
          "Пароль должен быть не менее 8 символов и содержать минимум одну заглавную букву, специальный символ и цифру"
        );
        return;
      }

      if (confirmPassword !== password) {
        setError("Пароли не совпадают");
        return;
      }
    }

    try {
      setIsLoading(true);

      if (phoneExists) {
        // Login
        await login(phone, password);
        setIsLoading(false);
        navigate("/main");
      } else {
        // If registration, go to name step
        setIsLoading(false);
        setStep("name");
      }
    } catch (err) {
      setError("Произошла ошибка. Пожалуйста, попробуйте снова.");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lastName.trim() || !firstName.trim()) {
      setError("Пожалуйста, введите фамилию и имя");
      return;
    }

    try {
      setIsLoading(true);
      await register(
        phone,
        password,
        { firstName, lastName, middleName: middleName.trim() || undefined },
        avatarFile
      );
      setIsLoading(false);
      navigate("/main");
    } catch (err) {
      setError("Произошла ошибка. Пожалуйста, попробуйте снова.");
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setPassword("");
    setError(null);
  };

  const handleBackToPassword = () => {
    setStep("password");
    setError(null);
  };

  return (
    <div className={styles.container}>
      <Header
        pageName="Войти или создать аккаунт"
        showLeftButton={true}
        showLogo={false}
        showRightButton={false}
        onLeftButtonClick={() => {
          navigate("/");
        }}
      />

      <div className={styles.content}>
        <div className={styles.form}>
          {step !== "name" && (
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <Logo width={76} height={27} />
              </div>
            </div>
          )}

          {step === "phone" && (
            <PhoneStep
              phone={phone}
              error={error}
              isLoading={isLoading}
              onPhoneChange={handlePhoneChange}
              onContinue={handleCheckPhone}
            />
          )}

          {step === "password" && (
            <PasswordStep
              phoneExists={phoneExists}
              password={password}
              confirmPassword={confirmPassword}
              onConfirmPasswordChange={handleConfirmPasswordChange}
              error={error}
              isLoading={isLoading}
              onPasswordChange={handlePasswordChange}
              onContinue={handlePasswordContinue}
              onBack={handleBackToPhone}
            />
          )}

          {step === "name" && (
            <NameStep
              firstName={firstName}
              lastName={lastName}
              middleName={middleName}
              error={error}
              isLoading={isLoading}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
              onMiddleNameChange={handleMiddleNameChange}
              onAvatarChange={handleAvatarChange}
              onSave={handleSave}
              onCancel={handleBackToPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};
