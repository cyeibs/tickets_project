import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const withQuery = (component: () => React.ReactNode) => () => {
  // Make sure we're wrapping the component with the QueryClientProvider
  return (
    <QueryClientProvider client={queryClient}>
      {component()}
    </QueryClientProvider>
  );
};
