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
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log('Token found, verifying...');
          
          try {
            // Try to get user data
            const userData = await authService.getCurrentUser();
            console.log('User verified:', userData);
            setUser(userData);
          } catch (err) {
            console.error('Token verification failed:', err);
            // Token is invalid or expired
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          console.log('No token found');
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      console.log('Login successful:', data);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err);
      throw err;
    }
  };

  const signup = async (email, username, password, firstName, lastName) => {
    setError(null);
    try {
      const data = await authService.signup(email, username, password, firstName, lastName);
      console.log('Signup successful:', data);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Signup error:', err);
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