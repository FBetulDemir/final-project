import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../assets/logo.png';

const Header: React.FC = () => {
  //*hamburger menu
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <header className='header'>
      <div className='logo-container'>
        <Link to='/'>
          {' '}
          <img src={Logo} alt='ShowTime Logo' className='logo-image' />
        </Link>
      </div>
      <nav className='nav-bar'>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li className='nav-item'>
            <Link to='/'>Home</Link>
          </li>
          <li className='nav-item'>
            <Link to='/browser'>Browse Events</Link>
          </li>
          <li className='nav-item'>
            <Link to='/genre/:genreName'>Explore Genres</Link>
          </li>
          <li className='nav-item'>
            <Link to='/login'>Login</Link>
          </li>
          <li className='nav-item'>
            <Link to='/register'>Sign Up</Link>
          </li>
          <li className='nav-item'>
            <Link to='/events/create' className='create-event-link'>
              Create Event
            </Link>
          </li>
        </ul>
        <div
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className='bar'></span>
          <span className='bar'></span>
          <span className='bar'></span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
