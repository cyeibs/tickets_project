import React from 'react';
import type { IconProps } from './index';

export const Logo: React.FC<IconProps> = ({
  size = 32,
  color = '#AFF940',
  title = 'App Logo',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="false"
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      {/* Простой пример логотипа - круг с буквой L */}
      <circle cx="16" cy="16" r="15" stroke={color} strokeWidth="2" />
      <path
        d="M12 10V22H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
