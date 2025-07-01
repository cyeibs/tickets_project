import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { IconProps } from '@shared/assets/icons';
import styles from './IconButton.module.scss';

/**
 * IconButton component that accepts either an icon or an image
 *
 * Usage with icon:
 * <IconButton icon={<HeartIcon />} />
 *
 * Usage with image:
 * <IconButton image={<img src="/path/to/image.png" alt="Button image" />} />
 */

// Update IconComponent type to use IconProps
type IconComponent = React.FC<IconProps>;

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Update icon prop to accept either a React.ReactNode or our IconComponent
  icon?: React.ReactNode | IconComponent;
  image?: React.ReactElement<HTMLImageElement>;
  variant?: 'basic' | 'accent' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  iconSize?: number;
  iconColor?: string;
  round?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  image,
  variant = 'basic',
  size = 'medium',
  iconSize,
  iconColor,
  className = '',
  round = true,
  isActive = false,
  isFocused = false,
  disabled = false,
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
    // If image is provided and icon is not, use the image
    if (!icon && image) {
      return image;
    }

    if (React.isValidElement(icon)) {
      return icon;
    }

    // If it's an icon component, render it with the appropriate props
    const IconComp = icon as IconComponent;

    // Set icon color based on variant and state
    let finalIconColor = iconColor;

    if (!finalIconColor) {
      if (variant === 'minimal' && isActive) {
        finalIconColor = '#AFF940';
      }
    }

    return <IconComp size={getIconSize()} color={finalIconColor} />;
  };

  // Build class names based on props
  const getClassNames = () => {
    const classNames = [
      styles.iconButton,
      styles[variant],
      styles[size],
      round ? styles.round : '',
      isActive ? styles.active : '',
      isFocused ? styles.focused : '',
      disabled ? styles.disabled : '',
      className,
    ];

    return classNames.filter(Boolean).join(' ');
  };

  return (
    <button className={getClassNames()} disabled={disabled} {...props}>
      {renderIcon()}
    </button>
  );
};
