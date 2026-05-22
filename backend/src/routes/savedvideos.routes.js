// src/routes/savedvideos.routes.js
const express = require('express');
const router = express.Router();
const savedVideoController = require('../controllers/savedVideoController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get current user's saved videos (protected)
router.get('/', authenticateToken, savedVideoController.getSavedVideos);

// Save a video (protected)
router.post('/:videoId', authenticateToken, savedVideoController.saveVideo);

// Remove saved video (protected)
router.delete('/:videoId', authenticateToken, savedVideoController.removeSavedVideo);

// Check if video is saved (protected)
router.get('/:videoId/is-saved', authenticateToken, savedVideoController.isVideoSaved);

module.exports = router;