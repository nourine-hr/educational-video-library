const express = require('express');
const router = express.Router();
const { getSavedVideos, saveVideo, unsaveVideo, isVideoSaved } = require('../controllers/savedVideoController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get all saved videos
router.get('/', authenticateToken, getSavedVideos);

// Save a video
router.post('/:videoId', authenticateToken, saveVideo);

// Remove saved video
router.delete('/:videoId', authenticateToken, unsaveVideo);

// Check if video is saved
router.get('/:videoId/is-saved', authenticateToken, isVideoSaved);

module.exports = router;