// import React, { useState, useEffect } from 'react';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate loading notifications
//     const timer = setTimeout(() => {
//       setNotifications([
//         {
//           id: 1,
//           type: 'reminder',
//           message: 'MOU with Tech University expires in 30 days',
//           date: '2023-11-15',
//           read: false
//         },
//         {
//           id: 2,
//           type: 'activity',
//           message: 'New MOU added with Design Institute',
//           date: '2023-11-10',
//           read: false
//         },
//         {
//           id: 3,
//           type: 'reminder',
//           message: 'Monthly activity report due tomorrow',
//           date: '2023-11-01',
//           read: true
//         }
//       ]);
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const markAsRead = (id) => {
//     setNotifications(prev => 
//       prev.map(notification => 
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   return (
//     <div className="notifications">
//       <h1>Notifications</h1>
      
//       {isLoading ? (
//         <p>Loading notifications...</p>
//       ) : (
//         <div className="notification-list">
//           {notifications.length === 0 ? (
//             <p>No notifications available</p>
//           ) : (
//             notifications.map(notification => (
//               <div 
//                 key={notification.id} 
//                 className={`notification-item ${notification.read ? 'read' : 'unread'}`}
//                 onClick={() => markAsRead(notification.id)}
//               >
//                 <div className="notification-type">{notification.type}</div>
//                 <div className="notification-message">{notification.message}</div>
//                 <div className="notification-date">{notification.date}</div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Notifications = () => {
  const [notificationPrefs, setNotificationPrefs] = useState({
    newMOU: true,
    renewalReminders: true,
    monthlySummary: true
  });
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch user's email from localStorage or context
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);
  }, []);

  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const savePreferences = async () => {
    setIsLoading(true);
    setStatus('');
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzRifE_Q5P91CIhJ4j-tRqqgx4SD9j-sJIOcz6sMxdIZfmFKbrlquQvCNrqIKw5yi4Y7w/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateNotificationPrefs',
          email,
          preferences: notificationPrefs
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('Preferences saved successfully!');
      } else {
        setStatus('Error saving preferences');
      }
    } catch (error) {
      setStatus('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><Header/>
    <div className="notifications-container">
      <h2>Email Notification Preferences</h2>
      <p>Manage how you receive notifications about MOUs</p>
      
      <div className="notification-prefs">
        <div className="pref-item">
          <label>
            <input
              type="checkbox"
              name="newMOU"
              checked={notificationPrefs.newMOU}
              onChange={handlePrefChange}
            />
            New MOU Entries
          </label>
          <p className="pref-description">Receive emails when new MOUs are added</p>
        </div>
        
        <div className="pref-item">
          <label>
            <input
              type="checkbox"
              name="renewalReminders"
              checked={notificationPrefs.renewalReminders}
              onChange={handlePrefChange}
            />
            Renewal Reminders
          </label>
          <p className="pref-description">Get reminders before MOUs expire</p>
        </div>
        
        <div className="pref-item">
          <label>
            <input
              type="checkbox"
              name="monthlySummary"
              checked={notificationPrefs.monthlySummary}
              onChange={handlePrefChange}
            />
            Monthly Summary
          </label>
          <p className="pref-description">Receive a monthly report of all MOUs</p>
        </div>
      </div>
      
      <div className="email-display">
        <p>Notifications will be sent to: <strong>{email}</strong></p>
      </div>
      
      <button 
        onClick={savePreferences}
        disabled={isLoading}
        className="save-btn"
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </button>
      
      {status && <p className="status-message">{status}</p>}
    </div>
    <Footer/>
    </>
  );
};

export default Notifications;