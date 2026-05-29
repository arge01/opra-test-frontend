import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { useApiMutation } from '../hooks/useOpra';
import { Lock, Mail, ArrowRight, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';
import { LoginInputType, LoginResponseType } from '../api';
import { ServiceApiError } from '@opra-frontend/react-service-toolkit/core';

export function Login() {
  const navigate = useNavigate();
  const { token, setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loginState, executeLogin] = useApiMutation<LoginResponseType, LoginInputType>({
    run: (api, payload) => api.$auth.login(payload)
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data: LoginResponseType = await executeLogin({ email, password });
      setAuth(data.accessToken, data.userId);
      navigate('/');
    } catch (err: ServiceApiError | unknown) {
      setError((err as ServiceApiError)?.message || 'Geçersiz kullanıcı adı veya şifre.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          OpraStore'a Giriş Yap
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          En iyi ürünler bir tık uzağında
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium flex items-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email Adresi</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 h-12 px-4 transition-colors"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Şifre</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 h-12 px-4 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginState.isLoading}
                className={clsx(
                  "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white transition-all",
                  loginState.isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                {loginState.isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                {!loginState.isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
