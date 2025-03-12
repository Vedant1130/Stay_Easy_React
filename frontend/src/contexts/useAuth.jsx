import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, logout } from "../api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../Components/ToastNotification/ToastNotification";
import Loader from "../Components/Loader/Loader";
import OtpPopup from "../Components/Popup/OtpPopup";
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

  const login_user = async (
    username,
    password,
    openOtpPopup,
    setRegisteredEmail
  ) => {
    try {
      const response = await login(username, password);
      console.log("🔍 Full Login Response:", response);

      if (
        response?.success &&
        response?.access_token &&
        response?.refresh_token
      ) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);

        await get_authenticated();
        setIsAuthenticated(true);
        showToast(response.message || "Login successful!", "success");
        nav("/");
        return true;
      } else {
        console.error("❌ Login response does not contain tokens:", response);
      }

      // ✅ Fix: Extract Email Correctly
      if (!response.success && response.message === "Email not verified") {
        showToast("Email is not verified", "error");

        // 🔍 Log possible locations of email
        console.log("📩 Checking response structure:", response);

        // Extract email from the correct location

        const email = response?.data?.data?.email || null;
        console.log("Extracted Email:", email);

        setRegisteredEmail(email); // Set email (fallback to username if missing)

        // Open OTP popup after a delay
        setTimeout(() => {
          openOtpPopup(true);
        }, 2000);
        return false;
      }

      showToast(response.message || "Invalid username or password", "error");
      return false;
    } catch (error) {
      console.error("❌ Login API Catch Error:", error);
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
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
