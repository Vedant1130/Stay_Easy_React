import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Login from "./Users/Login";
import { showToast } from "./ToastNotification/ToastNotification";

const PrivateRoute = ({ children, onOpenLogin }) => {
  const { isAuthenticated, loading, setLastAttemptedPage, lastAttemptedPage } =
    useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const toastShownRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (!lastAttemptedPage) {
        // If lastAttemptedPage is null, it means the user JUST logged out, so don't show another toast
        setLastAttemptedPage(children.props.path); // Store attempted page for later
        return;
      }

      if (!toastShownRef.current) {
        showToast("Please log in to access this page", "warning");
        toastShownRef.current = true;
      }

      setShowLogin(true);
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
