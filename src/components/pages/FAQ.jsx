import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './FAQ.css';
const FAQ = () => {
  const faqs = [
    {
      question: "How do I add a new MOU?",
      answer: "Navigate to the Dashboard and click on 'Add New MOU'. Fill in all required fields and submit the form."
    },
    {
      question: "Can I download MOU data?",
      answer: "Yes, you can filter and download MOU data in Excel format from the 'Download MOU Data' section."
    },
    {
      question: "How are notifications sent?",
      answer: "Notifications for renewals and monthly activities appear in your Notifications panel and are also sent via email."
    }
  ];

  return (
    <div className="page">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;