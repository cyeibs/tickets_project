import React from "react";
import { IconButton } from "../IconButton";
import { ArrowLeft, Edit, Logo, FilterIcon } from "@shared/assets/icons";
import styles from "./Header.module.scss";
import { SearchInput } from "../SearchInput";

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
   * Показывать ли поле поиска
   */
  showSearchInput?: boolean;

  /**
   * Показывать ли кнопку фильтра
   */
  showFilterButton?: boolean;

  /**
   * Обработчик нажатия на левую кнопку
   */
  onLeftButtonClick?: () => void;

  /**
   * Обработчик нажатия на правую кнопку
   */
  onRightButtonClick?: () => void;

  /**
   * Обработчик нажатия на кнопку фильтра
   */
  onFilterButtonClick?: () => void;

  /**
   * Обработчик изменения значения в поле поиска
   */
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageName,
  showLeftButton = true,
  showLogo = true,
  showRightButton = true,
  showSearchInput = false,
  showFilterButton = false,
  onLeftButtonClick,
  onRightButtonClick,
  onFilterButtonClick,
  onSearchChange,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.leftButton}>
          {showLeftButton && (
            <IconButton
              icon={ArrowLeft}
              variant="minimal"
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
              variant="minimal"
              iconColor="#FFFFFF"
              onClick={onRightButtonClick}
            />
          )}
        </div>
      </div>

      {(showSearchInput || showFilterButton) && (
        <div className={styles.searchRow}>
          {showSearchInput && (
            <div className={styles.searchInputContainer}>
              <SearchInput onChange={onSearchChange} />
            </div>
          )}
          {showFilterButton && (
            <IconButton
              icon={FilterIcon}
              variant="basic"
              onClick={onFilterButtonClick}
            />
          )}
        </div>
      )}

      {pageName && (
        <div className={styles.bottomRow}>
          <div className={styles.pageName}>{pageName}</div>
        </div>
      )}
    </header>
  );
};
