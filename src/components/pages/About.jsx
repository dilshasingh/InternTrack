import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './About.css';
const About = () => {
  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <h1>About MOUTracker</h1>
          <section>
            <h2>Our Mission</h2>
            <p>
              MOUTracker was developed to streamline the management of Memorandums of Understanding 
              between educational institutions and industry partners. Our goal is to automate the 
              tracking process and ensure no important deadlines are missed.
            </p>
          </section>
          
          <section>
            <h2>Features</h2>
            <ul>
              <li>Centralized MOU data management</li>
              <li>Automated renewal reminders</li>
              <li>Easy data entry and retrieval</li>
              <li>Customizable filtering options</li>
              <li>Secure document storage</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;