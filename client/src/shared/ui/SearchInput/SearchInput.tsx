import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./SearchInput.module.scss";
import { SearchIcon } from "@shared/assets/icons";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /** Whether the input is disabled */
  disabled?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, disabled = false, ...props }, ref) => {
    // Generate a unique ID if not provided
    const inputId =
      props.id || `search-input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`${styles.container} ${className || ""}`}>
        <div
          className={`${styles.inputWrapper} ${
            disabled ? styles.disabled : ""
          }`}
        >
          <div className={styles.searchIcon}>
            <SearchIcon color="#626974" size={20} />
          </div>

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            placeholder="Поиск"
            disabled={disabled}
            {...props}
          />
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
