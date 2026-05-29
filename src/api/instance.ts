import { OpraHttpClient } from '@opra/client';
import { OpraTest } from './OpraTest';

const client = new OpraHttpClient('http://localhost:3000', {
  interceptors: [
    {
      intercept: (request: any, next: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers = request.headers || new Headers();
          if (request.headers instanceof Headers) {
            request.headers.set('Authorization', `Bearer ${token}`);
          } else if (Array.isArray(request.headers)) {
            request.headers.push(['Authorization', `Bearer ${token}`]);
          } else {
            (request.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
          }
        }
        return next.handle(request);
      }
    }
  ]
});

export const api = new OpraTest(client);

// Export type for creating hooks
export type ApiType = typeof api;
