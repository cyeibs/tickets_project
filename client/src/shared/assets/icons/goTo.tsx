import React from "react";
import type { IconProps } from "./index";

export const GoToIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#AFF940",
  title = "GoToIcon",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M11.6797 15.12L14.2397 12.56L11.6797 10"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12.5601H14.17"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.5C16.42 4.5 20 7.5 20 12.5C20 17.5 16.42 20.5 12 20.5"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
