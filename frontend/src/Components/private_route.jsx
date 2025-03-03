import { useAuth } from "../contexts/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { showToast } from "./ToastNotification/ToastNotification"; // Adjust path if needed

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false); // Prevents multiple toasts

  useEffect(() => {
    if (!loading && !isAuthenticated && !toastShown.current) {
      showToast("You must be logged in to access this page.", "warning");
      toastShown.current = true; // Mark as shown to prevent duplicates
    }
  }, [loading, isAuthenticated]);

  if (loading) return null; // Wait for authentication check

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
