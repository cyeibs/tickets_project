import React, { useId } from 'react';

interface PhoneIconProps {
  size?: number;
  color?: string;
}

export const Phone: React.FC<PhoneIconProps> = ({
  size = 24,
  color = '#FFFFFF',
}) => {
  const titleId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>Phone Icon</title>
      <path
        d="M19.5066 16.8631L17.1006 14.4571C16.1509 13.5074 14.5705 13.7971 14.0457 14.9716C13.6559 15.7462 12.7062 16.1359 11.9316 15.8462C9.91195 15.2665 7.31252 12.7419 6.73281 10.6474C6.36807 9.87276 6.83276 8.92307 7.60735 8.53329C8.78183 8.00849 9.07157 6.42812 8.12188 5.47843L5.71591 3.07246C4.92628 2.35788 3.75179 2.35788 3.03721 3.07246L1.45684 4.65283C-0.123529 6.30825 0.746159 10.0677 4.05155 13.3731C7.35694 16.6785 11.1164 17.6231 12.7718 15.9677L14.3522 14.3873C15.0668 13.5977 15.0668 12.4232 14.3522 11.7086L19.5066 16.8631Z"
        fill={color}
      />
    </svg>
  );
};
