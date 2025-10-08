import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@features/auth";
import styles from "./SplashPage.module.scss";

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        navigate("/main");
      }
    }, 3500); // Показываем сплэш-экран 2.5 секунды для лучшего эффекта пульсации

    return () => clearTimeout(timer);
  }, [isLoading, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <img src="/splash-logo.png" alt="ЛУП Logo" className={styles.logo} />
      </div>
    </div>
  );
};
