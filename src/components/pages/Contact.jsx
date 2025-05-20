import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './Contact.css';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <h1>Contact Us</h1>
          
          {submitted ? (
            <div className="success-message">
              <p>Thank you for your message! We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          )}
          
          <div className="contact-info">
            <h2>Other Contact Methods</h2>
            <p><strong>Email:</strong> support@moutracker.edu</p>
            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
            <p><strong>Address:</strong> 123 University Ave, Campus City, CC 12345</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;