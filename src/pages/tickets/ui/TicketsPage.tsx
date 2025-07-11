import React from "react";
import styles from "./TicketsPage.module.scss";

export const TicketsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои билеты</h1>
      <div className={styles.content}>
        <p className={styles.emptyState}>У вас пока нет билетов</p>
        <p className={styles.hint}>
          Билеты на мероприятия будут отображаться здесь
        </p>
      </div>
    </div>
  );
};
