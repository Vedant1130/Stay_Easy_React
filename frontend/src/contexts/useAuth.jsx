import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, logout } from "../api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../Components/ToastNotification/ToastNotification";
import Loader from "../Components/Loader/Loader";

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
        setIsAuthenticated(false);
        setUser(null);
        showToast("Logged out successfully!", "success"); // ✅ Logout toast
        nav("/");
      } else {
        showToast("Logout failed. Try again!", "error"); // ❌ Error toast
      }
    } catch (error) {
      showToast("An error occurred while logging out.", "error"); // ❌ Error toast
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
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md">
          <Loader type="clip" size={50} color="#36D7B7" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
