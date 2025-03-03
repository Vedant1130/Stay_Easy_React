import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, logout } from "../api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../Components/ToastNotification/ToastNotification";
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
      // Delay hiding the loader by 2 seconds (2000ms)
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const login_user = async (username, password) => {
    try {
      const success = await login(username, password);

      if (!success) {
        // ❌ If login failed, stop here
        showToast("Invalid username or password", "error");
        return false;
      }

      await get_authenticated(); // ✅ Only call if login succeeds
      setIsAuthenticated(true);
      showToast("Login successful!", "success");
      nav("/")
      return true;
    } catch (error) {
      showToast("Something went wrong. Try again!", "error");
      return false;
    }
  };

  const logout_user = async () => {
    try {
      const success = await logout();
      if (success) {
        setLoading(true); // ✅ Start loader first
        setIsAuthenticated(false);
        setUser(null);
  
        await get_authenticated(); // ✅ Wait for authentication state to update
  
        showToast("Logged out successfully!", "success"); // ✅ Show toast naturally after loading finishes
        nav("/"); // ✅ Redirect after logout process completes
      } else {
        showToast("Logout failed. Try again!", "error");
      }
    } catch (error) {
      showToast("An error occurred while logging out.", "error");
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
