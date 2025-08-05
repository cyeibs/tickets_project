import React from "react";
import type { IconProps } from "./index";

export const ImageIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#ffffff",
  title = "ImageIcon",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M21.6809 16.9599L18.5509 9.64988C17.4909 7.16988 15.5409 7.06988 14.2309 9.42988L12.3409 12.8399C11.3809 14.5699 9.5909 14.7199 8.3509 13.1699L8.1309 12.8899C6.8409 11.2699 5.0209 11.4699 4.0909 13.3199L2.3709 16.7699C1.1609 19.1699 2.9109 21.9999 5.5909 21.9999H18.3509C20.9509 21.9999 22.7009 19.3499 21.6809 16.9599Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.9707 8C8.62756 8 9.9707 6.65685 9.9707 5C9.9707 3.34315 8.62756 2 6.9707 2C5.31385 2 3.9707 3.34315 3.9707 5C3.9707 6.65685 5.31385 8 6.9707 8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
