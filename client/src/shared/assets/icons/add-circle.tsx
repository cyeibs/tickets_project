import React from 'react';
import type { IconProps } from './index';

export const AddCircle: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'AddCircle',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M16 29.3334C23.3333 29.3334 29.3333 23.3334 29.3333 16C29.3333 8.66669 23.3333 2.66669 16 2.66669C8.66663 2.66669 2.66663 8.66669 2.66663 16C2.66663 23.3334 8.66663 29.3334 16 29.3334Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6666 16H21.3333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 21.3334V10.6667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
