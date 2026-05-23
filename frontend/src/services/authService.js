// src/services/authService.js
/*
  Functions for authentication (signup, login, logout)
  These call the backend API
*/

import api from './api';

const authService = {
  // POST /api/auth/signup
  signup: async (email, username, password, firstName, lastName) => {
    try {
      const response = await api.post('/auth/signup', {
        email,
        username,
        password,
        firstName,
        lastName
      });
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /api/auth/login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      // Store token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Clear token
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authService;