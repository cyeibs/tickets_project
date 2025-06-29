import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { IconProps } from '@shared/assets/icons';
import styles from './IconButton.module.scss';

// Update IconComponent type to use IconProps
type IconComponent = React.FC<IconProps>;

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Update icon prop to accept either a React.ReactNode or our IconComponent
  icon: React.ReactNode | IconComponent;
  variant?: 'primary' | 'secondary' | 'transparent';
  size?: 'small' | 'medium' | 'large';
  iconSize?: number;
  iconColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size,
  iconSize,
  iconColor,
  className,
  ...props
}) => {
  // Get appropriate icon size based on button size if not explicitly provided
  const getIconSize = () => {
    if (iconSize) return iconSize;

    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  // Determine if icon is a component or a node
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }

    // If it's an icon component, render it with the appropriate props
    const IconComp = icon as IconComponent;
    return <IconComp size={getIconSize()} color={iconColor} />;
  };

  return (
    <button
      className={`${styles.iconButton} ${styles[variant]} ${styles[size]} ${
        className || ''
      }`}
      {...props}
    >
      {renderIcon()}
    </button>
  );
};
