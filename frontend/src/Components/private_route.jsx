import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Login from "./Users/Login";
import { showToast } from "./ToastNotification/ToastNotification";

const PrivateRoute = ({ children, onOpenLogin }) => {
  const { isAuthenticated, loading, setLastAttemptedPage } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const toastShownRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLastAttemptedPage(children.props.path); // Store the private route
      setShowLogin(true);

      if (!toastShownRef.current) {
        // ✅ Show toast only once
        showToast("Please log in to access this page", "warning");
        toastShownRef.current = true;
      }
    }
  }, [isAuthenticated, loading]);
  return (
    <>
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            toastShownRef.current = false;
          }}
        />
      )}
      {isAuthenticated ? children : null}
    </>
  );
};

export default PrivateRoute;
