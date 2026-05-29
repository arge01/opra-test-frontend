import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    
    if (userId) localStorage.setItem('userId', userId);
    else localStorage.removeItem('userId');
  }, [token, userId]);

  const setAuth = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
