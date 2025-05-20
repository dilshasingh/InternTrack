import React, { useState } from 'react';
import { sendMonthlyReportEmail } from '../services/emailService';
import './MonthlyReport.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MonthlyReport = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');
    
    try {
      const result = await sendMonthlyReportEmail(email);
      setMessage(result.message);
    } catch (error) {
      setMessage('Error sending report: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <><Header/>
    <div className="monthly-report">
      <h2>Monthly MOU Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Recipient Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Monthly Report'}
        </button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
    <Footer/>
    </>
  );
};

export default MonthlyReport;