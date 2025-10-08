import React from "react";
import styles from "./EmptyState.module.scss";
import { Logo } from "@/shared/assets/icons";

type EmptyStateProps = {
  text: string;
  className?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ text, className }) => {
  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Logo width={76} height={27} />
        </div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default EmptyState;
