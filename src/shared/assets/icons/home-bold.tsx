import React from 'react';
import type { IconProps } from './index';

export const HomeIconBold: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'HomeIconBold',
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
        d="M12.1283 4.4209C13.9107 3.03985 16.8036 2.96761 18.6576 4.2666H18.6586L26.3383 9.63965C26.9638 10.0776 27.556 10.7957 27.9926 11.6318C28.4291 12.4681 28.6801 13.3661 28.6801 14.1338V23.1738C28.6799 26.2055 26.2186 28.667 23.1869 28.667H8.81384C5.78391 28.667 3.32068 26.1938 3.32068 23.1602V13.96C3.32074 13.2474 3.54718 12.3953 3.9447 11.5879C4.34211 10.7808 4.88197 10.0763 5.45056 9.63281L12.1273 4.41992L12.1283 4.4209ZM16.0004 18.334C15.0856 18.334 14.3335 19.0853 14.3334 20V24C14.3334 24.9149 15.0855 25.667 16.0004 25.667C16.9152 25.667 17.6674 24.9149 17.6674 24V20C17.6672 19.0853 16.9151 18.334 16.0004 18.334Z"
        fill={color}
        stroke="#212C3A"
        strokeWidth="1.33333"
      />
    </svg>
  );
};
