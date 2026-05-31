import { OpraHttpClient, HttpInterceptor } from '@opra/client';
import { OpraTest as ProductApi } from './products/OpraTest';
import { OpraCargo as CargoApi } from './cargo/OpraCargo';

const interceptors: HttpInterceptor[] = [
  {
    intercept: (request, next) => {
      const token = localStorage.getItem('token');
      if (token) {
        request.headers = request.headers || new Headers();
        if (request.headers instanceof Headers) {
          request.headers.set('Authorization', `Bearer ${token}`);
        } else if (Array.isArray(request.headers)) {
          (request.headers as string[][]).push(['Authorization', `Bearer ${token}`]);
        } else {
          (request.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
      }
      return next.handle(request);
    }
  }
];

const productClient = new OpraHttpClient('http://localhost:3000', { interceptors });
const cargoClient = new OpraHttpClient('http://localhost:3001', { interceptors });

export const productApi = new ProductApi(productClient);
export const cargoApi = new CargoApi(cargoClient);

export const api = {
  ...productApi,
  ...cargoApi
};

export type ApiType = typeof api;
