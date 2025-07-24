import React from "react";
import classNames from "classnames";
import styles from "./Pills.module.scss";
import { Avatar } from "../Avatar/Avatar";
import type { AvatarSize } from "../Avatar/Avatar";
import type { IconProps } from "@shared/assets/icons";

export interface PillsProps {
  icon?: React.ComponentType<IconProps>;
  avatar?: {
    src?: string;
    size?: AvatarSize;
    count?: number;
    backgroundColor?: string;
  };
  primaryText?: string;
  secondaryText?: string;
  rightIcon?: React.ComponentType<IconProps>;
  className?: string;
  onClick?: () => void;
}

export const Pills: React.FC<PillsProps> = ({
  icon: Icon,
  avatar,
  primaryText,
  secondaryText,
  rightIcon: RightIcon,
  className,
  onClick,
}) => {
  const Component = onClick ? "button" : "div";

  const content = (
    <>
      <div className={styles.leftContainer}>
        <div className={styles.iconContainer}>
          {Icon && (
            <Icon
              size={primaryText && secondaryText ? 32 : 24}
              color="#FFFFFF"
            />
          )}
          {avatar && (
            <Avatar
              src={avatar.src}
              size={avatar.size || 24}
              count={avatar.count}
              backgroundColor={avatar.backgroundColor}
            />
          )}
        </div>

        {(primaryText || secondaryText) && (
          <div className={styles.content}>
            {secondaryText && (
              <span className={styles.secondaryText}>{secondaryText}</span>
            )}
            {primaryText && (
              <span className={styles.primaryText}>{primaryText}</span>
            )}
          </div>
        )}
      </div>

      {RightIcon && (
        <div className={styles.rightIcon}>
          <RightIcon size={24} color="#FFFFFF" />
        </div>
      )}
    </>
  );

  return (
    <Component
      className={classNames(styles.pills, className)}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {content}
    </Component>
  );
};
