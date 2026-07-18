// ================================================================
// Shreedha Vastra — Auth Context
// ================================================================
// Holds the logged-in user's state app-wide. On first load, tries
// to restore the session by calling /auth/me (works because the
// JWT lives in an httpOnly cookie sent automatically by the browser).
// ================================================================
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { user } = await authService.getMe();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    const { user } = await authService.login(credentials);
    setUser(user);
    toast.success(`Welcome back, ${user.name}!`);
    return user;
  };

  const register = async (data) => {
    const { user } = await authService.register(data);
    setUser(user);
    toast.success(`Welcome to Shreedha Vastra, ${user.name}!`);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
