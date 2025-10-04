import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import styles from "./AutocompleteSelect.module.scss";
import { CrossIcon } from "@shared/assets/icons";

type Option = {
  label: string;
  value: string;
};

type AutocompleteSelectProps = {
  /** Label text displayed above the input field (optional) */
  label?: string;

  /** Error message to display below the input (optional) */
  error?: string;

  /** Hint text displayed below the input field (optional) */
  hint?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Options to display in the dropdown */
  options: Option[];

  /** Placeholder text */
  placeholder?: string;

  /** Selected value (controlled) */
  value?: string;

  /** Called when selected value changes */
  onChange?: (value: string | null) => void;

  /** Input value (controlled) */
  inputValue?: string;

  /** Called when input string changes */
  onInputChange?: (value: string) => void;

  /** Custom className */
  className?: string;

  /** Text to show when there are no matches */
  noOptionsText?: string;
};

export const AutocompleteSelect = forwardRef<
  HTMLInputElement,
  AutocompleteSelectProps
>(
  (
    {
      label,
      error,
      hint,
      disabled = false,
      options,
      placeholder,
      value,
      onChange,
      inputValue,
      onInputChange,
      className,
      noOptionsText = "Ничего не найдено",
    },
    ref
  ) => {
    const [internalInput, setInternalInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Generate a unique ID for input and list association
    const inputId = useMemo(
      () => `autocomplete-${Math.random().toString(36).substring(2, 9)}`,
      []
    );

    const currentInput = inputValue !== undefined ? inputValue : internalInput;

    const filteredOptions = useMemo(() => {
      const term = currentInput.trim().toLowerCase();
      if (!term) return options;
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(term) ||
          opt.value.toLowerCase().includes(term)
      );
    }, [currentInput, options]);

    const selectedOption = useMemo(() => {
      if (!value) return null;
      return options.find((o) => o.value === value) || null;
    }, [value, options]);

    const setInput = (next: string) => {
      if (onInputChange) onInputChange(next);
      else setInternalInput(next);
    };

    const open = () => {
      if (disabled) return;
      setIsOpen(true);
    };

    const close = () => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    };

    const handleSelect = (opt: Option) => {
      onChange?.(opt.value);
      setInput(opt.label);
      close();
    };

    const handleClear = () => {
      setInput("");
      onChange?.(null);
      open();
    };

    // Close on outside click
    useEffect(() => {
      const onClickOutside = (e: MouseEvent | TouchEvent) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target as Node)) {
          close();
        }
      };
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("touchstart", onClickOutside, {
        passive: true,
      });
      return () => {
        document.removeEventListener("mousedown", onClickOutside);
        document.removeEventListener("touchstart", onClickOutside);
      };
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        open();
        setHighlightedIndex((prev) => {
          const next = Math.min(prev + 1, filteredOptions.length - 1);
          return next;
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        open();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          e.preventDefault();
          handleSelect(filteredOptions[highlightedIndex]);
        }
        return;
      }
      if (e.key === "Escape") {
        close();
        return;
      }
    };

    // Ensure highlighted item stays in view
    useEffect(() => {
      if (!listRef.current) return;
      if (highlightedIndex < 0) return;
      const item = listRef.current.children[highlightedIndex] as
        | HTMLElement
        | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex]);

    const showClear = !!currentInput && !disabled;

    return (
      <div ref={rootRef} className={`${styles.container}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div
          className={`${styles.inputWrapper} ${error ? styles.error : ""} ${
            disabled ? styles.disabled : ""
          } ${className || ""}`}
          onClick={open}
        >
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            placeholder={placeholder}
            value={currentInput}
            onChange={(e) => {
              setInput(e.target.value);
              open();
            }}
            onFocus={open}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${inputId}-list`}
            aria-autocomplete="list"
          />

          {showClear && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Очистить"
            >
              <CrossIcon />
            </button>
          )}

          <div className={styles.suffix} aria-hidden>
            <span className={styles.caret} />
          </div>
        </div>

        {isOpen && (
          <ul
            id={`${inputId}-list`}
            className={styles.dropdown}
            role="listbox"
            ref={listRef}
          >
            {filteredOptions.length === 0 && (
              <li className={styles.noOptions} aria-disabled>
                {noOptionsText}
              </li>
            )}
            {filteredOptions.map((opt, idx) => {
              const isSelected = selectedOption?.value === opt.value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.option} ${
                    isSelected ? styles.selected : ""
                  } ${isHighlighted ? styles.highlighted : ""}`}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}

        {error && <p className={styles.errorText}>{error}</p>}
        {!error && hint && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

AutocompleteSelect.displayName = "AutocompleteSelect";
