import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: contact@moutracker.edu</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} MOUTracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;