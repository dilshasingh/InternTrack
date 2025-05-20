import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
// Use a public CORS proxy URL for development.
const PROXY_URL = 'http://localhost:3000/proxy?url=';
const SCRIPT_URL = PROXY_URL + encodeURIComponent('https://script.google.com/macros/s/AKfycby9Jtwc3gOuL2JEPSMB_ODJVH62f7hfOUx9uwjCiIf_epVhKGPUR6pDL-MkKh1UfdvkVw/exec');
import Header from '../common/Header';
import Footer from '../common/Footer';

const Login = ({ switchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        })
      });

      console.log('Raw response:', response); // Log entire response object
    
      const res = await response.json();
      console.log('Parsed response:', res); // Log parsed JSON response
      
      if (res.success) {
        setSuccess(res.message || 'Login successful!');
        localStorage.setItem('userEmail', email);
        onLoginSuccess();
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <><Header/>
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-header">Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /> 
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <button className="btn-link" onClick={() => navigate('/Register')}>
          New user? Register
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
