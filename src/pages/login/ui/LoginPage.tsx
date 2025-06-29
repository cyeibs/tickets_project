import { useAuth } from '@features/auth';
import { Button, Header, PhoneInput } from '@shared/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkPhone, login, register } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneExists, setPhoneExists] = useState<boolean | null>(null);

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

  const handleCheckPhone = async () => {
    if (!phone || phone.length < 10) {
      setError('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      setIsLoading(true);
      const { exists } = await checkPhone(phone);
      setPhoneExists(exists);
      setIsLoading(false);
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    try {
      setIsLoading(true);

      if (phoneExists) {
        // Login
        await login(phone, password);
      } else {
        // Register
        await register(phone, password);
      }

      setIsLoading(false);
      navigate('/main');
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
      setIsLoading(false);
    }
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
          <div className={styles.imageContainer}>
            <img src={'/login-image.png'} alt="logo" />
          </div>

          <PhoneInput
            value={phone}
            onChange={handlePhoneChange}
            error={error || undefined}
          />

          <Button>{isLoading ? 'Проверка...' : 'Продолжить'}</Button>
        </div>
      </div>
    </div>
  );
};
