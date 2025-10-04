import React from "react";
import type { IconProps } from "./index";

export const MinusIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#000000",
  title = "MinusIcon",
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
        d="M6 12H18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
