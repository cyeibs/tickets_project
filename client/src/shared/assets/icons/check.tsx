import React from "react";
import type { IconProps } from "./index";

export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#212C3A",
  title = "Check",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="false"
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <path
        d="M9.57825 15.642L19.2202 6L20.5005 7.28025L9.57825 18.2025L4.5 13.1257L5.78025 11.8455L9.57825 15.642Z"
        fill={color}
      />
    </svg>
  );
};
