import React from "react";
import type { IconProps } from "./index";

export const GalleryAddIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#ffffff",
  title = "GalleryAddIcon",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M9.5 10.5C10.6046 10.5 11.5 9.60457 11.5 8.5C11.5 7.39543 10.6046 6.5 9.5 6.5C8.39543 6.5 7.5 7.39543 7.5 8.5C7.5 9.60457 8.39543 10.5 9.5 10.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 2.5H9.5C4.5 2.5 2.5 4.5 2.5 9.5V15.5C2.5 20.5 4.5 22.5 9.5 22.5H15.5C20.5 22.5 22.5 20.5 22.5 15.5V10.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.25 5.5H21.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19 8.25V2.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.16992 19.4501L8.09992 16.1401C8.88992 15.6101 10.0299 15.6701 10.7399 16.2801L11.0699 16.5701C11.8499 17.2401 13.1099 17.2401 13.8899 16.5701L18.0499 13.0001C18.8299 12.3301 20.0899 12.3301 20.8699 13.0001L22.4999 14.4001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
