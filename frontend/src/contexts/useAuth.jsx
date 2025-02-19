import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, logout } from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastAttemptedPage, setLastAttemptedPage] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  const get_authenticated = async () => {
    try {
      const response = await is_authenticated();

      if (response && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login_user = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
      await get_authenticated();
    }
    return success;
  };

  const logout_user = async () => {
    const success = await logout();
    if (success) {
      setIsAuthenticated(false);
      setUser(null);
      nav("/");
    }
  };

  useEffect(() => {
    get_authenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login_user,
        logout_user,
        lastAttemptedPage,
        setLastAttemptedPage,
        showLoginPopup,
        setShowLoginPopup,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
