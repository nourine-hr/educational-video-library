// src/services/userService.js
/*
  Functions for user profile operations
*/

import api from './api';

const userService = {
  // GET /api/users/:userId
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/users/me
  getCurrentUserProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUT /api/users/:userId
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/users/:userId/videos
  getUserVideos: async (userId, page = 1, limit = 12) => {
    try {
      const response = await api.get(`/users/${userId}/videos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/users/:userId/followers
  getFollowers: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/users/:userId/following
  getFollowing: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /api/users/:userId/follow
  followUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /api/users/:userId/follow
  unfollowUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;