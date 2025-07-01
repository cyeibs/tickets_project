import React from 'react';
import type { IconProps } from './index';

export const CardIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#000000',
  title = 'CardIcon',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="false"
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7998 10.25C21.4598 10.25 22 10.7902 22 11.4502V16.4502C21.9999 18.7401 20.1395 20.5996 17.8496 20.5996H6.13965C3.84981 20.5994 2 18.7498 2 16.46V11.4502C2 10.7902 2.5402 10.25 3.2002 10.25H20.7998ZM6 15.75C5.59 15.75 5.25 16.09 5.25 16.5C5.25 16.91 5.59 17.25 6 17.25H8C8.41 17.25 8.75 16.91 8.75 16.5C8.75 16.09 8.41 15.75 8 15.75H6ZM10.5 15.75C10.09 15.75 9.75 16.09 9.75 16.5C9.75 16.91 10.09 17.25 10.5 17.25H14.5C14.91 17.25 15.25 16.91 15.25 16.5C15.25 16.09 14.91 15.75 14.5 15.75H10.5Z"
        fill={color}
      />
      <path
        d="M17.8496 3.39941C20.1396 3.39941 21.9999 5.25985 22 7.5498C22 8.2098 21.4598 8.75 20.7998 8.75H3.2002C2.5402 8.75 2 8.2098 2 7.5498V7.54004C2 5.25016 3.84981 3.3996 6.13965 3.39941H17.8496Z"
        fill={color}
      />
    </svg>
  );
};
