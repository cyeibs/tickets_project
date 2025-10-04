import React from "react";
import styles from "./Snackbar.module.scss";
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
} from "@/shared/assets/icons";

export type SnackbarItemType =
  | "main"
  | "search"
  | "ticket"
  | "profile"
  | "event-create";

interface SnackbarItemProps {
  type: SnackbarItemType;
  isActive: boolean;
  activeItem: SnackbarItemType;
  onClick: () => void;
}

export const SnackbarItem: React.FC<SnackbarItemProps> = ({
  type,
  isActive,
  activeItem,
  onClick,
}) => {
  const shouldAddBeEnlarged = type === "event-create" && activeItem === "main";

  const renderIcon = () => {
    const iconColor = "#FFFFFF";
    const iconColorBold = "#212C3A";
    const iconSize = 32;
    const iconColorAdd = shouldAddBeEnlarged ? "#212C3A" : "#FFFFFF";

    switch (type) {
      case "main":
        return isActive ? (
          <HomeIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <HomeIcon size={iconSize} color={iconColor} />
        );
      case "search":
        return isActive ? (
          <SearchIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <SearchIcon size={iconSize} color={iconColor} />
        );
      case "event-create":
        return isActive ? (
          <AddCircleBold size={iconSize} color={iconColorBold} />
        ) : (
          <AddCircle size={iconSize} color={iconColorAdd} />
        );
      case "ticket":
        return isActive ? (
          <TicketIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <TicketIcon size={iconSize} color={iconColor} />
        );
      case "profile":
        return isActive ? (
          <ProfileIconBold size={iconSize} color={iconColorBold} />
        ) : (
          <ProfileIcon size={iconSize} color={iconColor} />
        );
      default:
        return null;
    }
  };

  const getPositionClass = () => {
    switch (type) {
      case "main":
        return styles.homeItem;
      case "search":
        return styles.searchItem;
      case "event-create":
        return styles.addItem;
      case "ticket":
        return styles.ticketItem;
      case "profile":
        return styles.profileItem;
      default:
        return "";
    }
  };

  return (
    <button
      className={`
        ${styles.item} 
        ${getPositionClass()} 
        ${isActive ? styles.activeItem : ""} 
        ${shouldAddBeEnlarged ? styles.addEnlarged : ""}
      `}
      onClick={onClick}
      aria-label={`${type} navigation`}
      type="button"
    >
      {renderIcon()}
    </button>
  );
};
