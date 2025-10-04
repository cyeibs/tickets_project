import React from "react";
import type { IconProps } from "./index";

export const ArrowRight: React.FC<IconProps> = ({
  size = 24,
  color = "#000000",
  title = "Arrow Right",
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
        d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.07996"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
