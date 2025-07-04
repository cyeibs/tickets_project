import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import styles from './SplashPage.module.scss';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          navigate('/main');
        } else {
          navigate('/login');
        }
      }
    }, 3500); // Показываем сплэш-экран 2.5 секунды для лучшего эффекта пульсации

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <img src="/splash-logo.png" alt="ЛУП Logo" className={styles.logo} />
      </div>
    </div>
  );
};
