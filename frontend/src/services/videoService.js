// src/services/videoService.js
/*
  Functions for video operations
  - Get all videos
  - Get single video
  - Create video
  - Update video
  - Delete video
  - Save/unsave video
*/

import api from './api';

const videoService = {
  // GET /api/videos
  getAllVideos: async (page = 1, limit = 10, type = null) => {
    try {
      let url = `/videos?page=${page}&limit=${limit}`;
      if (type) url += `&type=${type}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/videos/:id
  getVideoById: async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/videos/creator/:creatorId
  getCreatorVideos: async (creatorId, page = 1, limit = 12) => {
    try {
      const response = await api.get(`/videos/creator/${creatorId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /api/videos
  createVideo: async (videoData) => {
    try {
      const response = await api.post('/videos', videoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUT /api/videos/:id
  updateVideo: async (videoId, videoData) => {
    try {
      const response = await api.put(`/videos/${videoId}`, videoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /api/videos/:id
  deleteVideo: async (videoId) => {
    try {
      const response = await api.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/saved-videos
  getSavedVideos: async (page = 1, limit = 12) => {
    try {
      const response = await api.get(`/saved-videos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST /api/saved-videos/:videoId
  saveVideo: async (videoId) => {
    try {
      const response = await api.post(`/saved-videos/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE /api/saved-videos/:videoId
  unsaveVideo: async (videoId) => {
    try {
      const response = await api.delete(`/saved-videos/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET /api/saved-videos/:videoId/is-saved
  isVideoSaved: async (videoId) => {
    try {
      const response = await api.get(`/saved-videos/${videoId}/is-saved`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default videoService;