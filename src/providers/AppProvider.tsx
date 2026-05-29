import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpraToolkitProvider } from '@opra-frontend/react-toolkit/core';
import { api } from '../api/instance';
import { AuthProvider } from './AuthContext';

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
            window.location.href = '/login';
          },
          onError: (err: any) => {
            console.error(err);
            alert(err.message || 'Bir hata oluştu');
          },
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </OpraToolkitProvider>
    </QueryClientProvider>
  );
}
