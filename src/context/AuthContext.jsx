import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (token) {
        try {
          // Setup a mock user for routing when local token exists (e.g. from a prior login simulation)
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const defaultUser = { id: 'usr-1', name: 'Karam Member', email: 'member@karam.in', role: 'CUSTOMER' };
            setUser(defaultUser);
            localStorage.setItem('user', JSON.stringify(defaultUser));
          }
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Simulation of login behavior until active backend endpoints are online
      const role = credentials?.role || 'ADMIN'; // Default to admin for easy dashboard access
      const dummyUser = {
        id: 'usr-admin',
        name: 'KARAM Admin Manager',
        email: credentials?.email || 'admin@karam.in',
        role: role
      };
      const dummyToken = 'simulated_jwt_token_for_karam_portal';
      
      setToken(dummyToken);
      setUser(dummyUser);
      localStorage.setItem('token', dummyToken);
      localStorage.setItem('user', JSON.stringify(dummyUser));
      setLoading(false);
      return { user: dummyUser, token: dummyToken };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulation of register calls
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
