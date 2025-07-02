import React from 'react';
import styles from './Snackbar.module.scss';
import {
  HomeIcon,
  HomeIconBold,
  SearchIcon,
  SearchIconBold,
  AddCircle,
  AddCircleBold,
  TicketIcon,
  TicketIconBold,
  ProfileIcon,
  ProfileIconBold,
} from '@/shared/assets/icons';

export type SnackbarItemType = 'home' | 'search' | 'add' | 'ticket' | 'profile';

interface SnackbarItemProps {
  type: SnackbarItemType;
  isActive: boolean;
  onClick: () => void;
}

export const SnackbarItem: React.FC<SnackbarItemProps> = ({
  type,
  isActive,
  onClick,
}) => {
  const renderIcon = () => {
    const iconColor = '#FFFFFF';
    const iconColorBold = '#212C3A';
    const iconSize = 32;

    switch (type) {
      case 'home':
        return isActive ? (
          <HomeIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <HomeIcon size={iconSize} color={iconColor} />
        );
      case 'search':
        return isActive ? (
          <SearchIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <SearchIcon size={iconSize} color={iconColor} />
        );
      case 'add':
        return isActive ? (
          <AddCircleBold size={iconSize} color={iconColorBold} />
        ) : (
          <AddCircle size={iconSize} color={iconColor} />
        );
      case 'ticket':
        return isActive ? (
          <TicketIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <TicketIcon size={iconSize} color={iconColor} />
        );
      case 'profile':
        return isActive ? (
          <ProfileIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <ProfileIcon size={iconSize} color={iconColor} />
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={`${styles.item} ${isActive ? styles.activeItem : ''}`}
      onClick={onClick}
      aria-label={`${type} navigation`}
      type="button"
    >
      {renderIcon()}
    </button>
  );
};
