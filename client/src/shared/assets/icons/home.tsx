import React from 'react';
import type { IconProps } from './index';

export const HomeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'HomeIcon',
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
        d="M12.0266 3.78666L4.83996 9.38666C3.63996 10.32 2.66663 12.3067 2.66663 13.8133V23.6933C2.66663 26.7867 5.18663 29.32 8.27996 29.32H23.72C26.8133 29.32 29.3333 26.7867 29.3333 23.7067V14C29.3333 12.3867 28.2533 10.32 26.9333 9.39999L18.6933 3.62666C16.8266 2.31999 13.8266 2.38666 12.0266 3.78666Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 23.9867V19.9867"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
