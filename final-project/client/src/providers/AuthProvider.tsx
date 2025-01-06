import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  Username: string;
  Password: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null; // Include user information
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // State for user information
  const [loading, setLoading] = useState(true);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData); // Set user information
    const expirationTime = Date.now() + SESSION_TIMEOUT;
    localStorage.setItem("authExpiration", expirationTime.toString());
    localStorage.setItem("token", "some-valid-token"); // Replace with actual token
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authExpiration");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const expirationTime = localStorage.getItem("authExpiration");
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && expirationTime && Date.now() < parseInt(expirationTime, 10) && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser)); // Restore user information
      } else {
        logout();
      }
      setLoading(false);
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};