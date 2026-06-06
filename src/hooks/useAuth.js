import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { user, token, loading, isAuthenticated, login, logout, register } = useAuthContext();
  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    register
  };
}

export default useAuth;
