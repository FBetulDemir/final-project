import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../assets/logo.png';

const Header: React.FC = () => {
    return (
        <header className='header'>
            <div className='logo-container'>
                <img src={Logo} alt='EventHub Logo' className='logo-image' />
                <span className='logo-text'>EventHub</span>
            </div>
            <nav>
                <ul className='nav-links'>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/browse'>Browse Events</Link>
                    </li>
                    <li>
                        <Link to='/login'>Login</Link>
                    </li>
                    <li>
                        <Link to='/signup'>Sign Up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
