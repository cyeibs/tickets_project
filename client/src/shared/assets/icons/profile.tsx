import React, { useId } from 'react';
import type { IconProps } from './index';

export const ProfileIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'ProfileIcon',
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
        d="M16.16 17.04C16.0667 17.0266 15.9467 17.0266 15.84 17.04C13.4934 16.96 11.6267 15.04 11.6267 12.68C11.6267 10.2666 13.5734 8.30664 16 8.30664C18.4134 8.30664 20.3734 10.2666 20.3734 12.68C20.36 15.04 18.5067 16.96 16.16 17.04Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.9866 25.84C22.6133 28.0133 19.4666 29.3334 16 29.3334C12.5333 29.3334 9.38664 28.0133 7.01331 25.84C7.14664 24.5867 7.94664 23.36 9.37331 22.4C13.0266 19.9734 19 19.9734 22.6266 22.4C24.0533 23.36 24.8533 24.5867 24.9866 25.84Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 29.3334C23.3638 29.3334 29.3333 23.3638 29.3333 16C29.3333 8.63622 23.3638 2.66669 16 2.66669C8.63616 2.66669 2.66663 8.63622 2.66663 16C2.66663 23.3638 8.63616 29.3334 16 29.3334Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
