import { createContext, useContext, useEffect, useState } from 'react';
import { demoLogin, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('rescueloop_token');
    if (!token?.startsWith('mock-')) return null;

    try {
      return JSON.parse(localStorage.getItem('rescueloop_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('rescueloop_token');
    return Boolean(token && !token.startsWith('mock-'));
  });

  useEffect(() => {
    const token = localStorage.getItem('rescueloop_token');
    if (!token || token.startsWith('mock-')) return undefined;

    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('rescueloop_token');
        localStorage.removeItem('rescueloop_role');
        localStorage.removeItem('rescueloop_email');
        localStorage.removeItem('rescueloop_user');
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  async function login(payload) {
    const result = await demoLogin(payload);
    localStorage.setItem('rescueloop_token', result.token);
    localStorage.setItem('rescueloop_role', result.user.role);
    localStorage.setItem('rescueloop_email', result.user.email);
    localStorage.setItem('rescueloop_user', JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  }

  function logout() {
    localStorage.removeItem('rescueloop_token');
    localStorage.removeItem('rescueloop_role');
    localStorage.removeItem('rescueloop_email');
    localStorage.removeItem('rescueloop_user');
    setUser(null);
  }

  const value = { user, loading, isAuthenticated: Boolean(user), login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
