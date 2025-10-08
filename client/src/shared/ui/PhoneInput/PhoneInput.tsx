import React, { useState } from "react";
import { Phone } from "@shared/assets/icons";
import styles from "./PhoneInput.module.scss";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract only digits
    const digits = e.target.value.replace(/\D/g, "");

    // Limit to 10 digits (excluding country code)
    const limitedDigits = digits.slice(0, 10);

    // Format the phone number
    onChange(limitedDigits);
  };

  const formatPhoneNumber = (phoneDigits: string) => {
    if (!phoneDigits) return "";

    let formattedNumber = "";

    // Format: (XXX) XXX XX XX
    if (phoneDigits.length > 0) {
      formattedNumber += "(";
      formattedNumber += phoneDigits.slice(0, Math.min(3, phoneDigits.length));
      formattedNumber += phoneDigits.length > 3 ? ") " : "";
    }

    if (phoneDigits.length > 3) {
      formattedNumber += phoneDigits.slice(3, Math.min(6, phoneDigits.length));
      formattedNumber += phoneDigits.length > 6 ? " " : "";
    }

    if (phoneDigits.length > 6) {
      formattedNumber += phoneDigits.slice(6, Math.min(8, phoneDigits.length));
      formattedNumber += phoneDigits.length > 8 ? " " : "";
    }

    if (phoneDigits.length > 8) {
      formattedNumber += phoneDigits.slice(8, 10);
    }

    return formattedNumber;
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.phonePrefix}>+7</div>
      <input
        type="tel"
        value={formatPhoneNumber(value)}
        onChange={handleInputChange}
        className={styles.input}
        placeholder="(999) 999 99 99"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};
