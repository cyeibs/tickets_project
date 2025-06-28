import React from "react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent";
  size?: "small" | "medium" | "large";
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "primary",
  size = "medium",
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.iconButton} ${styles[variant]} ${styles[size]} ${
        className || ""
      }`}
      {...props}
    >
      {icon}
    </button>
  );
};
