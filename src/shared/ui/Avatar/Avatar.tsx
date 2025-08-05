import React from "react";
import classNames from "classnames";
import styles from "./Avatar.module.scss";
import { ImageIcon } from "@/shared/assets/icons";

export type AvatarSize = 12 | 24 | 32 | 48 | 64 | 100;

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  count?: number; // Added count prop to show "+X" text
  backgroundColor?: string; // Added prop for custom background color
  uploading?: boolean; // Added prop to show uploading state
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 32,
  className,
  count,
  backgroundColor,
  uploading = false,
}) => {
  const style = backgroundColor ? { backgroundColor } : {};

  return (
    <div
      className={classNames(
        styles.avatar,
        styles[`size${size}`],
        uploading && styles.uploading,
        className
      )}
      style={style}
    >
      {src && !count && <img src={src} alt={alt} />}
      {uploading && <ImageIcon size={24} color="#575757" />}
      {count && <span className={styles.countText}>+{count}</span>}
    </div>
  );
};
