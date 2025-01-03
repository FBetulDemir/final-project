import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean; // Track loading state
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading state

  // Login function that sets the token and expiration time
  const login = () => {
    setIsAuthenticated(true);
    const expirationTime = Date.now() + SESSION_TIMEOUT;
    localStorage.setItem("authExpiration", expirationTime.toString());
    localStorage.setItem("token", "some-valid-token"); // This should be your actual token from login
  };

  // Logout function that clears session and token
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authExpiration");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const expirationTime = localStorage.getItem("authExpiration");
      const token = localStorage.getItem("token");

      if (token && expirationTime && Date.now() < parseInt(expirationTime, 10)) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        logout(); // Logout if no token or session has expired
      }
      setLoading(false); // Done with auth check
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
