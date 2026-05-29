import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { LogOut, ShoppingBag } from 'lucide-react';

export function Layout() {
  const { token, logout, userId } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center space-x-2 text-indigo-600">
                <ShoppingBag className="w-8 h-8" />
                <span className="font-bold text-xl tracking-tight">OpraStore</span>
              </div>
              <nav className="hidden md:flex space-x-4">
                <Link to="/" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                  Satın Aldıklarım
                </Link>
                <Link to="/products" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                  Tüm Ürünler
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500 font-medium">Hoş geldin, <span className="text-slate-900">{userId}</span></span>
              <button
                onClick={logout}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
