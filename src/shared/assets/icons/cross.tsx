import React from 'react';
import type { IconProps } from './index';

export const CrossIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#626974',
  title = 'Close',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
