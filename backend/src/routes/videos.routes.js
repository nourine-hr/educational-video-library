// src/routes/videos.routes.js
/*
  This file defines all video-related endpoints.
  
  Routes are organized by resource:
  - GET /api/videos → Get all videos
  - GET /api/videos/:id → Get one video
  - POST /api/videos → Create video
  - PUT /api/videos/:id → Update video
  - DELETE /api/videos/:id → Delete video
  
  The actual logic is in controllers (separate file).
*/

const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

const { authenticateToken } = require('../middleware/authMiddleware');
// Public routes (anyone can access)
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.get('/creator/:creatorId', videoController.getVideosByCreator);
router.post('/', authenticateToken, videoController.createVideo);
router.put('/:id', authenticateToken, videoController.updateVideo);
router.delete('/:id', authenticateToken, videoController.deleteVideo);
// Protected routes (need token)
// router.post('/', authenticateToken, videoController.createVideo);
// router.put('/:id', authenticateToken, videoController.updateVideo);
// router.delete('/:id', authenticateToken, videoController.deleteVideo);

// Get all public videos (pagination supported)
router.get('/', videoController.getAllVideos);

// Get single video by ID
router.get('/:id', videoController.getVideoById);

// Get all videos from specific creator
router.get('/creator/:creatorId', videoController.getVideosByCreator);

// Create new video (requires authentication)
// router.post('/', authenticateToken, videoController.createVideo);

// Update video (requires authentication)
// router.put('/:id', authenticateToken, videoController.updateVideo);

// Delete video (requires authentication)
// router.delete('/:id', authenticateToken, videoController.deleteVideo);

module.exports = router;