import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SplashPage } from '@pages/splash';
import { LoginPage } from '@pages/login';
import { RegisterPage } from '@pages/register';
import { MainPage } from '@pages/main';
import { ErrorBoundary } from '@shared/ui/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/main',
    element: <MainPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
    errorElement: <ErrorBoundary />,
  },
]);
