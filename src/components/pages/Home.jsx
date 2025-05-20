import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './Home.css';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Newsroom from '../pages/Newsroom';
const Home = ({ isLoggedIn }) => {
  return (
    <div className="home-page">
      <Header isLoggedIn={isLoggedIn} />
      
      <main className="main-content">
        <section className="hero">
          <div className="container">
            <h1>Automated MOU Data Management</h1>
            <p>Streamline your Memorandum of Understanding tracking process with our comprehensive solution</p>
            {!isLoggedIn && (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            )}
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>Key Features</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <h3>Easy Data Entry</h3>
                <p>Quickly enter and manage all MOU details in one centralized platform</p>
              </div>
              <div className="feature-card">
                <h3>Smart Filters</h3>
                <p>Download MOU data with powerful filtering options by year, faculty, or institution</p>
              </div>
              <div className="feature-card">
                <h3>Automated Notifications</h3>
                <p>Never miss renewal deadlines with our intelligent reminder system</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <About/>
      <Contact/>
      <FAQ/>
      <Newsroom/> */}
      <Footer />
    </div>
  );
};

export default Home;