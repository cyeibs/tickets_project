import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { Header, Snackbar, SnackbarItem } from "@shared/ui";
import type { SnackbarItemType } from "@shared/ui/Snackbar/SnackbarItem";
import { useAuth } from "@features/auth";
import styles from "./MainLayout.module.scss";

// Type for route handle data
export interface RouteHandle {
  headerProps?: {
    showLogo?: boolean;
    showLeftButton?: boolean;
    showRightButton?: boolean;
    showSearchInput?: boolean;
    showFilterButton?: boolean;
    pageName?: string;
    navigateTo?: string; // Добавляем поле для пути навигации
  };
  showHeader?: boolean;
  showSnackbar?: boolean;
}

export const MainLayout: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState<SnackbarItemType>("main");
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();

  // Get the current route's handle data
  // Find the most specific match (deepest path) that has a handle
  const routeMatch = matches
    .filter((match) => Boolean(match.handle))
    .slice(-1)[0]; // Get the last (most specific) match with a handle
  const routeHandle = routeMatch?.handle as RouteHandle | undefined;

  // Default header props
  const defaultHeaderProps = {
    showLogo: true,
    showLeftButton: false,
    showRightButton: false,
  };

  // Merge default header props with route-specific header props
  const headerProps = {
    ...defaultHeaderProps,
    ...(routeHandle?.headerProps || {}),
  };

  // Determine if header and snackbar should be shown
  const showHeader = routeHandle?.showHeader !== false;
  const showSnackbar = routeHandle?.showSnackbar !== false;

  // Set active nav item based on current path
  useEffect(() => {
    const path = location.pathname.substring(1) || "main";
    if (
      ["main", "search", "event-create", "ticket", "profile"].includes(path)
    ) {
      setActiveNavItem(path as SnackbarItemType);
    }
  }, [location.pathname]);

  const handleNavItemClick = (item: SnackbarItemType) => {
    setActiveNavItem(item);
    navigate(`/${item === "main" ? "main" : item}`);
  };

  // Обработчик для кнопки фильтра
  const handleFilterButtonClick = () => {
    if (headerProps.navigateTo) {
      navigate(headerProps.navigateTo);
    }
  };

  const onLeftButtonClick = () => {
    if (headerProps.navigateTo) {
      navigate(-1);
    }
  };

  return (
    <div className={styles.layout}>
      {showHeader && (
        <Header
          showLogo={headerProps.showLogo}
          showLeftButton={headerProps.showLeftButton}
          showRightButton={headerProps.showRightButton}
          showSearchInput={headerProps.showSearchInput}
          showFilterButton={headerProps.showFilterButton}
          pageName={headerProps.pageName}
          onLeftButtonClick={onLeftButtonClick}
          onFilterButtonClick={handleFilterButtonClick} // Передаем обработчик для кнопки фильтра
        />
      )}

      <div className={styles.content}>
        <Outlet />
      </div>

      {showSnackbar && (
        <div className={styles.snackbarContainer}>
          <Snackbar>
            <SnackbarItem
              type="main"
              isActive={activeNavItem === "main"}
              activeItem={activeNavItem}
              onClick={() => handleNavItemClick("main")}
            />
            <SnackbarItem
              type="search"
              isActive={activeNavItem === "search"}
              activeItem={activeNavItem}
              onClick={() => handleNavItemClick("search")}
            />
            <SnackbarItem
              type="event-create"
              isActive={activeNavItem === "event-create"}
              activeItem={activeNavItem}
              onClick={() => handleNavItemClick("event-create")}
            />
            <SnackbarItem
              type="ticket"
              isActive={activeNavItem === "ticket"}
              activeItem={activeNavItem}
              onClick={() => handleNavItemClick("ticket")}
            />
            <SnackbarItem
              type="profile"
              isActive={activeNavItem === "profile"}
              activeItem={activeNavItem}
              onClick={() => {
                handleNavItemClick("profile");
              }}
            />
          </Snackbar>
        </div>
      )}
    </div>
  );
};
