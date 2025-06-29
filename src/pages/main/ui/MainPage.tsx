import React from 'react';
import { useAuth } from '@features/auth';
import styles from './MainPage.module.scss';

export const MainPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Главная</h1>

      {user && (
        <div className={styles.userInfo}>
          <p className={styles.userText}>
            Добро пожаловать, {user.name || user.phone}
          </p>
        </div>
      )}

      <button type="button" className={styles.logoutButton} onClick={logout}>
        Выйти
      </button>
    </div>
  );
};
