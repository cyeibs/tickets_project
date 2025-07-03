import React, { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './TextField.module.scss';
import { CrossIcon } from '@shared/assets/icons';
import { IconButton } from '../IconButton';

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Label text displayed above the input field (optional) */
  label?: string;

  /** Error message to display below the input (optional) */
  error?: string;

  /** Hint text displayed below the input field (optional) */
  hint?: string;

  /** Content to display at the beginning of the input field (optional) */
  prefixElement?: React.ReactNode;

  /** Content to display at the end of the input field (optional) */
  suffixElement?: React.ReactNode;

  /** Whether to show the clear button when the input has a value */
  showClearButton?: boolean;

  /** Callback when the clear button is clicked */
  onClear?: () => void;

  /** Whether the input is disabled */
  disabled?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      hint,
      prefixElement,
      suffixElement,
      className,
      showClearButton = true,
      onClear,
      id,
      value,
      onChange,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    // Generate a unique ID if not provided
    const inputId =
      id || `text-field-${Math.random().toString(36).substring(2, 9)}`;

    // Track internal value state if component is uncontrolled
    const [internalValue, setInternalValue] = useState('');

    // Determine if we should show the clear button
    const inputValue = value !== undefined ? String(value) : internalValue;
    const showClear = showClearButton && inputValue && !disabled;

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    // Handle clear button click
    const handleClear = () => {
      setInternalValue('');
      if (onClear) {
        onClear();
      }

      // Create a synthetic event to simulate clearing the input
      if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div
          className={`${styles.inputWrapper} ${
            error ? styles.error : ''
          } ${disabled ? styles.disabled : ''}`}
        >
          {prefixElement && (
            <div className={styles.prefix}>{prefixElement}</div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />

          {showClear && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
            >
              <CrossIcon />
            </button>
          )}

          {suffixElement && (
            <div className={styles.suffix}>{suffixElement}</div>
          )}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {!error && hint && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
