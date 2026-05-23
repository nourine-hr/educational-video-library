// src/hooks/useAuth.js
/*
  Custom hook to access auth context from any component
  
  Usage:
  const { user, login, logout } = useAuth();
*/

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};