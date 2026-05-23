// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in when app first loads
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token is still valid by fetching user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          // Token is invalid or expired
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        // No token, user not logged in
        setUser(null);
      }
      
      // ALWAYS set loading to false when done
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signup = async (email, username, password, firstName, lastName) => {
    setError(null);
    try {
      const data = await authService.signup(email, username, password, firstName, lastName);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};