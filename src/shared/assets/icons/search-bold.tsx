import React, { useId } from 'react';
import type { IconProps } from './index';

export const SearchIconBold: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'SearchIconBold',
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
        d="M15.3333 28C22.3289 28 28 22.3289 28 15.3333C28 8.33772 22.3289 2.66666 15.3333 2.66666C8.33769 2.66666 2.66663 8.33772 2.66663 15.3333C2.66663 22.3289 8.33769 28 15.3333 28Z"
        fill={color}
      />
      <path
        d="M28.4 29.3333C28.16 29.3333 27.92 29.24 27.7466 29.0667L25.2666 26.5867C24.9066 26.2267 24.9066 25.64 25.2666 25.2667C25.6266 24.9067 26.2133 24.9067 26.5866 25.2667L29.0666 27.7467C29.4266 28.1067 29.4266 28.6933 29.0666 29.0667C28.88 29.24 28.64 29.3333 28.4 29.3333Z"
        fill={color}
      />
    </svg>
  );
};
