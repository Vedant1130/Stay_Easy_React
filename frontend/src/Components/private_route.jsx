import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Users/Login";

const PrivateRoute = ({ children, onOpenLogin }) => {
  const { isAuthenticated, loading, setLastAttemptedPage } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLastAttemptedPage(children.props.path); // Store the private route
      setShowLogin(true);
    }
  }, [isAuthenticated, setLastAttemptedPage, loading, navigate]);

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <>
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => setShowLogin(false)}
        />
      )}
      {isAuthenticated ? children : null}
    </>
  );
};

export default PrivateRoute;
