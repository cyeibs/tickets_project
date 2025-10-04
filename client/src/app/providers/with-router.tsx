import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';

export const withRouter = (component: () => React.ReactNode) => () => {
  return <RouterProvider router={router} />;
};
