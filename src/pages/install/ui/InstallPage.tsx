import { Header } from '@shared/ui/Header';
import React from 'react';
import styles from './InstallPage.module.scss';

export const InstallPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header
        pageName="Установка приложения"
        showLeftButton={false}
        showLogo={true}
        showRightButton={false}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>Установка на домашний экран</h1>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>iOS (iPhone, iPad)</h2>
          <ol className={styles.steps}>
            <li>Откройте сайт в браузере Safari</li>
            <li>
              Нажмите на кнопку «Поделиться»{' '}
              <span className={styles.icon}>⎙</span> внизу экрана
            </li>
            <li>Прокрутите вниз и выберите «На экран «Домой»»</li>
            <li>Нажмите «Добавить» в правом верхнем углу</li>
          </ol>
          <div className={styles.note}>
            После установки приложение будет работать в полноэкранном режиме без
            элементов браузера
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Android</h2>
          <ol className={styles.steps}>
            <li>Откройте сайт в браузере Chrome</li>
            <li>Нажмите на три точки в правом верхнем углу</li>
            <li>
              Выберите «Установить приложение» или «Добавить на главный экран»
            </li>
            <li>Подтвердите установку</li>
          </ol>
          <div className={styles.note}>
            После установки приложение будет доступно на домашнем экране и в
            меню приложений
          </div>
        </div>
      </div>
    </div>
  );
};
