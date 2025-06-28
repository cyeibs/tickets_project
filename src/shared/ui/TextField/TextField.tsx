import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./TextField.module.scss";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "outlined" | "filled";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      startIcon,
      endIcon,
      className,
      variant = "outlined",
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const inputId =
      id || `text-field-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`${styles.container} ${className || ""}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div
          className={`${styles.inputWrapper} ${styles[variant]} ${
            error ? styles.error : ""
          }`}
        >
          {startIcon && <div className={styles.startIcon}>{startIcon}</div>}

          <input ref={ref} id={inputId} className={styles.input} {...props} />

          {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }
);
