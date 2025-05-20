import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './Newsroom.css';
const Newsroom = () => {
  const newsItems = [
    {
      id: 1,
      title: "MOUTracker Launches New Features",
      date: "November 1, 2023",
      summary: "We've added new filtering options and improved the notification system."
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      date: "October 15, 2023",
      summary: "The platform will be unavailable on October 20 from 2:00 AM to 4:00 AM for scheduled maintenance."
    }
  ];

  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <h1>Newsroom</h1>
          
          <div className="news-list">
            {newsItems.map(news => (
              <article key={news.id} className="news-item">
                <h2>{news.title}</h2>
                <p className="news-date">{news.date}</p>
                <p className="news-summary">{news.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsroom;