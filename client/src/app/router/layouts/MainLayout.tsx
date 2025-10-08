import { Header, Snackbar, SnackbarItem, Toast } from "@shared/ui";
import type { SnackbarItemType } from "@shared/ui/Snackbar/SnackbarItem";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import { useAuth } from "@/features/auth";

export interface RouteHandle {
  headerProps?: {
    showLogo?: boolean;
    showLeftButton?: boolean;
    showRightButton?: boolean;
    showSearchInput?: boolean;
    showFilterButton?: boolean;
    pageName?: string;
    navigateTo?: string;
  };
  showHeader?: boolean;
  showSnackbar?: boolean;
}

export const MainLayout: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState<SnackbarItemType>("main");
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();

  const routeMatch = matches
    .filter((match) => Boolean(match.handle))
    .slice(-1)[0];
  const routeHandle = routeMatch?.handle as RouteHandle | undefined;

  const defaultHeaderProps = {
    showLogo: true,
    showLeftButton: false,
    showRightButton: false,
  };

  const headerProps = {
    ...defaultHeaderProps,
    ...(routeHandle?.headerProps || {}),
  };

  const showHeader = routeHandle?.showHeader !== false;
  const showSnackbar = routeHandle?.showSnackbar !== false;

  useEffect(() => {
    const path = location.pathname.substring(1) || "main";
    if (
      ["main", "search", "event-create", "ticket", "profile"].includes(path)
    ) {
      setActiveNavItem(path as SnackbarItemType);
    }
  }, [location.pathname]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  const handleNavItemClick = (item: SnackbarItemType) => {
    setActiveNavItem(item);
    navigate(`/${item === "main" ? "main" : item}`);
  };

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(location.search);
    const value = event.target.value;
    if (value) params.set("q", value);
    else params.delete("q");
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const { isAuthenticated } = useAuth();

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
          onFilterButtonClick={handleFilterButtonClick}
          onSearchChange={handleSearchChange}
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
              onClick={() => {
                if (isAuthenticated) {
                  handleNavItemClick("event-create");
                } else {
                  navigate("/login");
                }
              }}
            />
            <SnackbarItem
              type="ticket"
              isActive={activeNavItem === "ticket"}
              activeItem={activeNavItem}
              onClick={() => {
                if (isAuthenticated) {
                  handleNavItemClick("ticket");
                } else {
                  navigate("/login");
                }
              }}
            />
            <SnackbarItem
              type="profile"
              isActive={activeNavItem === "profile"}
              activeItem={activeNavItem}
              onClick={() => {
                if (isAuthenticated) {
                  handleNavItemClick("profile");
                } else {
                  navigate("/login");
                }
              }}
            />
          </Snackbar>
        </div>
      )}
      <Toast />
    </div>
  );
};
