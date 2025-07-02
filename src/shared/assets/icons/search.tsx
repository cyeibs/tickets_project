import React, { useId } from 'react';
import type { IconProps } from './index';

export const SearchIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'SearchIcon',
}) => {
  const titleId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{title}</title>
      <path
        d="M15.3333 28C22.3289 28 28 22.329 28 15.3334C28 8.33775 22.3289 2.66669 15.3333 2.66669C8.33769 2.66669 2.66663 8.33775 2.66663 15.3334C2.66663 22.329 8.33769 28 15.3333 28Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.3333 29.3334L26.6666 26.6667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
