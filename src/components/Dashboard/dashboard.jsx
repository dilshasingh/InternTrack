
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
const Dashboard = ({ onLogout }) => {
  return (
    <>
    <Header/>
   
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
       
        <button onClick={onLogout} className="btn btn-logout">Logout</button>
      </header>
      
      <div className="dashboard-grid">
        <Link to="/mou-form" className="dashboard-card">
          <h2>Add New MOU</h2>
          <p>Enter details of a new Memorandum of Understanding</p>
        </Link>
        
        <Link to="/mou-download" className="dashboard-card">
          <h2>Download MOU Data</h2>
          <p>Filter and download existing MOU information</p>
        </Link>
        
        <Link to="/notifications" className="dashboard-card">
          <h2>Notifications</h2>
          <p>View alerts and reminders</p>
        </Link>

        {/* <Link to="/services/monthly-report" className="dashboard-card">
  <h2>Monthly Report</h2>
  <p>Generate and send monthly MOU reports</p>
</Link> */}

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Dashboard;