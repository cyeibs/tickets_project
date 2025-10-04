import React from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "primary",
  className,
}) => {
  return (
    <div
      className={`${styles.loader} ${styles[size]} ${styles[color]} ${
        className || ""
      }`}
    >
      <div className={styles.spinner}></div>
    </div>
  );
};
