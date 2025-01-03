import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect checks if the user has been authenticated, 
    // and prevents unnecessary redirects on initial load.
    if (!loading && !isAuthenticated && location.pathname !== "/") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  // While loading, don't render the ProtectedRoute
  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  // If the user is authenticated, render the child component
  // If not authenticated, navigate to the login page
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
