import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
const Header = ({ isLoggedIn }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">MOUTracker</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/newsroom">Newsroom</Link></li>
          {isLoggedIn ? (
            <li><Link to="/dashboard">Dashboard</Link></li>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;