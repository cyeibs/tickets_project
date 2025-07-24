import React from "react";
import classNames from "classnames";
import styles from "./Avatar.module.scss";

export type AvatarSize = 12 | 24 | 32 | 48 | 64 | 100;

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  count?: number; // Added count prop to show "+X" text
  backgroundColor?: string; // Added prop for custom background color
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 32,
  className,
  count,
  backgroundColor,
}) => {
  const style = backgroundColor ? { backgroundColor } : {};

  return (
    <div
      className={classNames(styles.avatar, styles[`size${size}`], className)}
      style={style}
    >
      {src && !count && <img src={src} alt={alt} />}
      {count && <span className={styles.countText}>+{count}</span>}
    </div>
  );
};
