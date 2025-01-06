import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";

interface CustomProtectedRouteProps {
  children: React.ReactNode;
}

const CustomProtectedRoute: React.FC<CustomProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); // Assumes your route contains an ID parameter for the event
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuthorization, setLoadingAuthorization] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/events/get-event/${id}`);
        const event = response.data;
        
        // Check if the authenticated user is the musician who made the event
        if (user && event && event.ArtistName === user.Username) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error fetching event or authorization check failed:", error);
      }
      setLoadingAuthorization(false);
    };

    if (isAuthenticated) {
      fetchEvent();
    } else {
      setLoadingAuthorization(false);
    }
  }, [id, isAuthenticated, user]);

  // Display loading message if the authorization check is in progress
  if (loading || loadingAuthorization) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Redirect to unauthorized page if not authorized
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default CustomProtectedRoute;