import React, { useState } from 'react';
import './style.css';
const PROXY_URL = 'http://localhost:3000/proxy?url=';
const SCRIPT_URL = PROXY_URL + encodeURIComponent('https://script.google.com/macros/s/AKfycby9Jtwc3gOuL2JEPSMB_ODJVH62f7hfOUx9uwjCiIf_epVhKGPUR6pDL-MkKh1UfdvkVw/exec');
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Register = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleRegisteration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'register',
          name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
        })
      });

      console.log('Raw response:', response); // Log entire response object
    
      const res = await response.json();
      console.log('Parsed response:', res); // Log parsed JSON response

      if (res.success) {
        setSuccess(res.message || 'Registered successfully!');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <><Header/>
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-header">Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <form onSubmit={handleRegisteration}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <button className="btn-link" onClick={() => navigate('/login')}>
          Already have an account? 
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Register;
