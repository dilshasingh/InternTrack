// // import React, { useState } from 'react';
// // import Login from './components/Login';
// // import Register from './components/Register';
// // import Dashboard from './components/dashboard';
// // const App = () => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [showLogin, setShowLogin] = useState(true); // State to toggle between login and register

// //   const handleLoginSuccess = () => {
// //     setIsLoggedIn(true); // Set logged in state to true
// //   };

// //   const switchToRegister = () => {
// //     setShowLogin(false); // Switch to register form
// //   };

// //   const switchToLogin = () => {
// //     setShowLogin(true); // Switch to login form
// //   };

// //   if (isLoggedIn) {
// //     return (
// //       <div className="dashboard">
// //         {/* <h1>Welcome to the Dashboard!</h1> */}
// //         <Dashboard />
// //         <button onClick={() => setIsLoggedIn(false)}>Logout</button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="auth-container">
// //       {showLogin ? (
// //         <Login switchToRegister={switchToRegister} onLoginSuccess={handleLoginSuccess} />
// //       ) : (
// //         <Register switchToLogin={switchToLogin} />
// //       )}
// //     </div>
// //   );
// // };

// // export default App;
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Register from './components/Register';
// import Dashboard from './components/Dashboard';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(true);

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   const switchToRegister = () => {
//     setShowLogin(false);
//   };

//   const switchToLogin = () => {
//     setShowLogin(true);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <div className="auth-container">
//                 {showLogin ? (
//                   <Login 
//                     switchToRegister={switchToRegister} 
//                     onLoginSuccess={handleLoginSuccess} 
//                   />
//                 ) : (
//                   <Register switchToLogin={switchToLogin} />
//                 )}
//               </div>
//             )
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             isLoggedIn ? (
//               <Dashboard onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import About from './components/pages/About';
import FAQ from './components/pages/FAQ';
import Contact from './components/pages/Contact';
import Newsroom from './components/pages/Newsroom';
import MOUForm from './components/dashboard/MOUForm';
import MOUDownload from './components/dashboard/MOUDownload';
import Notifications from './components/dashboard/Notifications';
import MonthlyReport from './components/Dashboard/MonthlyReport'; 
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/newsroom" element={<Newsroom />} />
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/mou-form" 
          element={
            isLoggedIn ? (
              <MOUForm />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/mou-download" 
          element={
            isLoggedIn ? (
              <MOUDownload />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/notifications" 
          element={
            isLoggedIn ? (
              <Notifications />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

<Route path="/services/monthly-report" element={<MonthlyReport />} />
      </Routes>
    </Router>
  );
};

export default App;