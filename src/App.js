import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import OfferPage from './pages/OffersPage'; // Import the OfferPage component
import Markets from './components/Markets'; // Import the Markets component from components folder
import RealTimeCryptoChart from './components/RealTimeCryptoChart'; // Import the RealTimeCryptoChart component
import NASDAQStockChart from './components/NASDAQStockChart'; // Import the NASDAQStockChart component
import { useAuth } from './context/AuthContext';
import 'animate.css/animate.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import { getDarkMode, setDarkMode } from './utils/darkMode';
import MarketNews from "./components/MarketNews";
import {ToastContainer} from "react-toastify";

const App = () => {
  const [darkMode, setDarkModeState] = useState(getDarkMode());
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDarkMode(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkModeState(prevMode => !prevMode);
  };

  return (
    <>
      <Header onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage darkMode={darkMode} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage darkMode={darkMode} /> : <Navigate to="/" />} />
        <Route path="/profile" element={<ProtectedRoute component={ProfilePage} darkMode={darkMode} />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} darkMode={darkMode} />} />
        <Route path="/offers" element={<OfferPage darkMode={darkMode} />} />
        <Route path="/markets" element={<Markets darkMode={darkMode} />} />
        <Route path="/marketNews" element={<MarketNews darkMode={darkMode} />} />
        <Route path="/chart" element={<ProtectedRoute component={RealTimeCryptoChart} darkMode={darkMode} />} /> {/* Crypto Chart page */}
        <Route path="/nasdaq" element={<ProtectedRoute component={NASDAQStockChart} darkMode={darkMode} />} /> {/* NASDAQ Stock Chart page */}
        <Route path="*" element={<HomePage darkMode={darkMode} />} />
      </Routes>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
      />
    </>
  );
};

export default App;
