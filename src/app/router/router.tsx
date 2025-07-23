import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { SplashPage } from "@pages/splash";
import { LoginPage } from "@pages/login";
import { RegisterPage } from "@pages/register";
import { MainPage } from "@pages/main";
import { InstallPage } from "@pages/install";
import { SearchPage } from "@pages/search";
import { TicketsPage } from "@pages/tickets";
import { ProfilePage } from "@pages/profile";
import { SubscriptionsPage } from "@pages/subscriptions";
import { AboutCompanyPage } from "@pages/about-company";
import { LegalDocsPage } from "@pages/legal-docs";
import { ErrorBoundary } from "@shared/ui/ErrorBoundary";
import { MainLayout } from "./layouts";
import { isMobileDevice, isTelegramApp, isStandaloneMode } from "@shared/lib";
import { MyEventsPage } from "@/pages/my-events";
import { StoriesPage } from "@/pages/stories";

// Wrapper component to handle mobile redirect logic
const MobileRedirectWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   // Skip if we're already on the install page or the user has dismissed the redirect
  //   if (
  //     location.pathname === '/install' ||
  //     localStorage.getItem('installRedirectDismissed')
  //   ) {
  //     return;
  //   }

  //   const shouldRedirect = isMobileDevice() && !isStandaloneMode();

  //   if (shouldRedirect) {
  //     // Save the current path to redirect back after installation or dismissal
  //     sessionStorage.setItem('redirectFromPath', location.pathname);
  //     navigate('/install');
  //   }
  // }, [navigate, location.pathname]);

  return <>{children}</>;
};

// Wrap each route component with the MobileRedirectWrapper
const withMobileRedirect = (Component: React.ComponentType) => {
  return (props: any) => (
    <MobileRedirectWrapper>
      <Component {...props} />
    </MobileRedirectWrapper>
  );
};

// Apply the wrapper to all route components except InstallPage
const WrappedSplashPage = withMobileRedirect(SplashPage);
const WrappedLoginPage = withMobileRedirect(LoginPage);
const WrappedRegisterPage = withMobileRedirect(RegisterPage);

// Get the basename from the environment or use the default for GitHub Pages
const getBasename = () => {
  // Extract from the current URL to support GitHub Pages
  const pathSegments = window.location.pathname.split("/");
  if (pathSegments.length > 1 && pathSegments[1] === "tickets_project") {
    return "/tickets_project";
  }
  return "";
};

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <WrappedSplashPage />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/login",
      element: <WrappedLoginPage />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/register",
      element: <WrappedRegisterPage />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/install",
      element: <InstallPage />,
      errorElement: <ErrorBoundary />,
    },
    {
      // Layout routes for pages that need header and snackbar
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "main",
          element: <MainPage />,
        },
        {
          path: "search",
          element: <SearchPage />,
          // Override default header props for search page
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: false,
              showRightButton: false,
              showSearchInput: true,
              showFilterButton: true,
            },
          },
        },
        {
          path: "ticket",
          element: <TicketsPage />,
          // Custom header props for tickets page
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: false,
              showRightButton: false,
              pageName: "Билеты",
            },
          },
        },
        {
          path: "profile",
          element: <ProfilePage />,
          // Custom header props for tickets page
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: false,
              showRightButton: false,
              pageName: "Профиль",
            },
          },
        },
        {
          path: "subscriptions",
          element: <SubscriptionsPage />,
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: true,
              showRightButton: false,
              pageName: "Подписки",
            },
          },
        },
        {
          path: "about-company/:id",
          element: <AboutCompanyPage />,
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: true,
              showRightButton: false,
              pageName: "Об организации",
            },
          },
        },
        {
          path: "legal-docs/:id",
          element: <LegalDocsPage />,
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: true,
              showRightButton: false,
              pageName: "Юридические документы",
            },
          },
        },
        {
          path: "my-events/:id",
          element: <MyEventsPage />,
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: true,
              showRightButton: false,
              pageName: "Мои события",
            },
          },
        },
        {
          path: "my-stories/:id",
          element: <StoriesPage />,
          handle: {
            headerProps: {
              showLogo: false,
              showLeftButton: true,
              showRightButton: false,
              pageName: "Сторисы",
            },
          },
        },
        {
          path: "add",
          element: <div>Add Event Page (to be implemented)</div>,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
      errorElement: <ErrorBoundary />,
    },
  ],
  {
    basename: getBasename(),
  }
);
