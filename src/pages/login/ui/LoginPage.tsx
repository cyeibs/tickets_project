import { useAuth } from "@features/auth";
import { Header } from "@shared/ui";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { PhoneStep } from "./PhoneStep";
import { PasswordStep } from "./PasswordStep";
import { NameStep } from "./NameStep";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkPhone, login, register } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError(null);
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
    if (!name.trim()) {
      setError("Пожалуйста, введите ваше имя");
      return;
    }

    try {
      setIsLoading(true);
      // Register with name
      await register(phone, password);
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
        showLeftButton={false}
        showLogo={false}
        showRightButton={false}
      />

      <div className={styles.content}>
        <div className={styles.form}>
          {step !== "name" && (
            <div className={styles.imageContainer}>
              <img src={"./login-image.png"} alt="logo" />
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
              error={error}
              isLoading={isLoading}
              onPasswordChange={handlePasswordChange}
              onContinue={handlePasswordContinue}
              onBack={handleBackToPhone}
            />
          )}

          {step === "name" && (
            <NameStep
              name={name}
              error={error}
              isLoading={isLoading}
              onNameChange={handleNameChange}
              onSave={handleSave}
              onCancel={handleBackToPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};
