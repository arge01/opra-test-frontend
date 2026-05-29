import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpraToolkitProvider } from '@opra-frontend/react-toolkit/core';
import { api } from '../api/instance';
import { AuthProvider } from './AuthContext';

import toast from 'react-hot-toast';

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OpraToolkitProvider
        config={{
          apiInstance: api,
          onAuthError: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          },
          onError: (err: unknown) => {
            console.error(err);
            toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
          },
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </OpraToolkitProvider>
    </QueryClientProvider>
  );
}
