import { Header } from "@shared/ui/Header";
import React from "react";
import styles from "./Privacy.module.scss";

export const PrivacyPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header
        pageName="Правовая информация"
        showLeftButton={false}
        showLogo={true}
        showRightButton={false}
      />

      <div className={styles.content}>
        <div className={styles.title}>Правовая информация</div>
        <div>
          <div>
            <span className={styles.infoTextBold}>ИНН: </span>
            <span className={styles.infoText}> 773421651470</span>
          </div>
          <div>
            <span className={styles.infoTextBold}>ОГРНИП: </span>
            <span className={styles.infoText}> 325774600476750</span>
          </div>
          <div>
            <span className={styles.infoTextBold}>ИП: </span>
            <span className={styles.infoText}>Лапшакова Евгения Сергеевна</span>
          </div>
          <div>
            <span className={styles.infoTextBold}>Почта: </span>
            <span className={styles.infoText}>jnsak@bk.ru</span>
          </div>
        </div>
      </div>
    </div>
  );
};
