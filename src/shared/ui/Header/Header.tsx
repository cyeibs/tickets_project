import React from 'react';
import { IconButton } from '../IconButton';
import { ArrowLeft, Edit, Logo } from '@shared/assets/icons';
import styles from './Header.module.scss';

interface HeaderProps {
  /**
   * Название страницы, отображаемое в хедере
   */
  pageName?: string;

  /**
   * Показывать ли кнопку "назад" слева
   */
  showLeftButton?: boolean;

  /**
   * Показывать ли логотип по центру
   */
  showLogo?: boolean;

  /**
   * Показывать ли кнопку "редактировать" справа
   */
  showRightButton?: boolean;

  /**
   * Обработчик нажатия на левую кнопку
   */
  onLeftButtonClick?: () => void;

  /**
   * Обработчик нажатия на правую кнопку
   */
  onRightButtonClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageName,
  showLeftButton = true,
  showLogo = true,
  showRightButton = true,
  onLeftButtonClick,
  onRightButtonClick,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.leftButton}>
          {showLeftButton && (
            <IconButton
              icon={ArrowLeft}
              variant="transparent"
              iconColor="#FFFFFF"
              onClick={onLeftButtonClick}
            />
          )}
        </div>

        <div className={styles.logoContainer}>{showLogo && <Logo />}</div>

        <div className={styles.rightButton}>
          {showRightButton && (
            <IconButton
              icon={Edit}
              variant="transparent"
              iconColor="#FFFFFF"
              onClick={onRightButtonClick}
            />
          )}
        </div>
      </div>

      {pageName && (
        <div className={styles.bottomRow}>
          <div className={styles.pageName}>{pageName}</div>
        </div>
      )}
    </header>
  );
};
