// src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/me', authenticateToken, userController.getCurrentUserProfile);  // MUST come FIRST
router.get('/:userId', userController.getUserProfile);    // Then the dynamic route


// Update current user's profile (protected)
router.put('/:userId', authenticateToken, userController.updateUserProfile);

// Get videos from specific user
router.get('/:userId/videos', userController.getUserVideos);

// Get followers of a user
router.get('/:userId/followers', userController.getFollowers);

// Get users that a user is following
router.get('/:userId/following', userController.getFollowing);

// Follow a user (protected)
router.post('/:userId/follow', authenticateToken, userController.followUser);

// Unfollow a user (protected)
router.delete('/:userId/follow', authenticateToken, userController.unfollowUser);

module.exports = router;