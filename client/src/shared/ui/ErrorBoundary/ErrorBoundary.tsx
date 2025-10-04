import React from 'react';
import { useRouteError } from 'react-router-dom';
import styles from './ErrorBoundary.module.scss';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Упс! Что-то пошло не так</h1>
      <p className={styles.message}>
        Произошла ошибка в приложении. Пожалуйста, попробуйте еще раз.
      </p>
      <button type="button" className={styles.button} onClick={handleGoHome}>
        Вернуться на главную
      </button>
    </div>
  );
};
