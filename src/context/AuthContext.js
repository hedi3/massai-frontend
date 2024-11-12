// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    const auth = storedAuthState === 'true';
    console.log('Initial authentication state:', auth); // Log initial authentication state
    return auth;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      const parsedUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
      console.log('Initial user data from localStorage:', parsedUser); // Log initial user data
      return parsedUser;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  });

  const login = (userData) => {
    console.log('Attempting to log in user:', userData); // Log user data being passed to login
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User logged in successfully. Authentication state set to true.');
    console.log('User data saved to localStorage:', userData); // Log user data saved to localStorage
  };

  const logout = () => {
    console.log('Logging out user.'); // Log logout attempt
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    console.log('User logged out successfully. Authentication state set to false.');
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('Storage change event detected:', e); // Log storage event
      if (e.key === 'isAuthenticated') {
        const newAuthState = e.newValue === 'true';
        console.log('Authentication state changed. New value:', newAuthState);
        setIsAuthenticated(newAuthState);
        if (newAuthState) {
          const storedUser = localStorage.getItem('user');
          try {
            const parsedUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
            setUser(parsedUser);
            console.log('User data updated from localStorage:', parsedUser); // Log updated user data
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
