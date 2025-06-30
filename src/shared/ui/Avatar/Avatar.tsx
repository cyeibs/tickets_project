import React from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.scss';

export type AvatarSize = 12 | 24 | 32 | 48 | 64 | 100;

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 32,
  className,
}) => {
  return (
    <div
      className={classNames(styles.avatar, styles[`size${size}`], className)}
    >
      {src && <img src={src} alt={alt} />}
    </div>
  );
};
