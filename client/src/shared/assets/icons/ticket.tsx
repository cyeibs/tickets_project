import React from 'react';
import type { IconProps } from './index';

export const TicketIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'TicketIcon',
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
        d="M25.2134 19.59C25.2134 21.31 26.6267 22.71 28.3467 22.71C28.3467 27.71 27.0934 28.9633 22.0934 28.9633H9.58671C4.58671 28.9633 3.33337 27.71 3.33337 22.71V22.0967C5.05337 22.0967 6.46671 20.6833 6.46671 18.9633C6.46671 17.2433 5.05337 15.83 3.33337 15.83V15.2167C3.34671 10.2167 4.58671 8.96332 9.58671 8.96332H22.08C27.08 8.96332 28.3334 10.2167 28.3334 15.2167V16.47C26.6134 16.47 25.2134 17.8567 25.2134 19.59Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.6148 8.96335H9.49475L13.4014 5.05669C16.5881 1.87002 18.1881 1.87002 21.3748 5.05669L22.1748 5.85669C21.3348 6.69669 21.1348 7.93669 21.6148 8.96335Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1719 8.96356L13.1719 28.9636"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 5"
      />
    </svg>
  );
};
