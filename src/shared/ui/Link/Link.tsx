import type { ButtonHTMLAttributes, FC } from "react";
import styles from "./Link.module.scss";
import { ArrowRight } from "@/shared/assets/icons";

export interface LinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
  accent?: boolean;
}

export const Link: FC<LinkProps> = ({
  text,
  className = "",
  accent = false,
  disabled = false,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    accent ? styles.accent : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      <span className={styles.text}>{text}</span>
      <div className={styles.iconWrapper}>
        <ArrowRight size={24} color={accent ? "#23222A" : "#23222A"} />
      </div>
    </button>
  );
};
