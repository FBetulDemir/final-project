import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider"; // Import the useAuth hook
import "./Header.css";
import Logo from "../assets/logo.png";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth(); // Access isAuthenticated and logout

  return (
    <header className="header">
      <div className="header-cont">
        <div className="logo-container">
          <img src={Logo} alt="ShowTime Logo" className="logo-image" />
          <span className="logo-text">ShowTime</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/browser">Browse Events</Link>
            </li>
            <li>
              <Link to="/genre">Explore Genres</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Sign Up</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/events/create" className="create-event-link">
                Create Event
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;