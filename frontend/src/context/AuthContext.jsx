import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const profile = await userApi.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const { token: accessToken, user: authUser, refreshToken } = response;

      setToken(accessToken);
      setUser(authUser);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFirebase = async (idToken) => {
    setLoading(true);
    try {
      const response = await authApi.loginWithFirebase(idToken);
      const { token: accessToken, user: authUser, refreshToken } = response;

      setToken(accessToken);
      setUser(authUser);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      const { token: accessToken, user: authUser, refreshToken } = response;

      setToken(accessToken);
      setUser(authUser);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await authApi.logout(refreshToken);
    } catch {
      // Client logout should still succeed if API is unavailable.
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    }
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
        loginWithFirebase,
        logout,
        register,
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
