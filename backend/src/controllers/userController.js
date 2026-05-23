// src/controllers/userController.js
const pool = require('../config/database');

/*
  GET /api/users/:userId
  Get public profile of any user (no auth required)
*/
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user profile
    const result = await pool.query(`
      SELECT 
        id,
        username,
        first_name,
        last_name,
        bio,
        profile_image_url,
        is_verified,
        created_at
      FROM users
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get follower count
    const followerCount = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [userId]
    );

    // Get following count
    const followingCount = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [userId]
    );

    // Get video count
    const videoCount = await pool.query(
      'SELECT COUNT(*) FROM videos WHERE creator_id = $1 AND is_public = true',
      [userId]
    );

    res.json({
      ...user,
      followers_count: parseInt(followerCount.rows[0].count),
      following_count: parseInt(followingCount.rows[0].count),
      videos_count: parseInt(videoCount.rows[0].count)
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};



/*
  GET /api/users/me
  Get CURRENT logged-in user's profile (protected)
*/
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From middleware

    const result = await pool.query(`
      SELECT 
        id,
        email,
        username,
        first_name,
        last_name,
        bio,
        profile_image_url,
        is_verified,
        created_at
      FROM users
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/*
  PUT /api/users/:userId
  Update user profile (protected - can only update own profile)
*/
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From middleware
    const { id: paramId } = req.params;

    // Can only update own profile
    if (parseInt(userId) !== parseInt(paramId)) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const { firstName, lastName, bio, profileImageUrl } = req.body;

    // Update user
    const result = await pool.query(`
      UPDATE users
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        bio = COALESCE($3, bio),
        profile_image_url = COALESCE($4, profile_image_url),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, username, email, first_name, last_name, bio, profile_image_url
    `, [firstName || null, lastName || null, bio || null, profileImageUrl || null, userId]);

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/*
  GET /api/users/:userId/videos
  Get all public videos from a user
*/
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const offset = (page - 1) * limit;

    // Get videos
    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        language,
        video_url,
        thumbnail_url,
        duration_seconds,
        category,
        views_count,
        created_at
      FROM videos
      WHERE creator_id = $1 AND is_public = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM videos WHERE creator_id = $1 AND is_public = true',
      [userId]
    );

    res.json({
      videos: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

/*
  GET /api/users/:userId/followers
  Get list of users following this user
*/
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;

    // Get followers
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.profile_image_url,
        u.bio
      FROM users u
      JOIN follows f ON u.id = f.follower_id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    // Get count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [userId]
    );

    res.json({
      followers: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
};

/*
  GET /api/users/:userId/following
  Get list of users this user is following
*/
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;

    // Get following
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.profile_image_url,
        u.bio
      FROM users u
      JOIN follows f ON u.id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    // Get count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [userId]
    );

    res.json({
      following: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
};

/*
  POST /api/users/:userId/follow
  Follow a user (protected)
*/
const followUser = async (req, res) => {
  try {
    const followerId = req.user.id; // Who is following
    const { userId: followingId } = req.params; // Who they're following

    // Can't follow yourself
    if (parseInt(followerId) === parseInt(followingId)) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    // Check if already following
    const checkResult = await pool.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    // Create follow relationship
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [followerId, followingId]
    );

    res.status(201).json({ message: 'Successfully followed user' });

  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

/*
  DELETE /api/users/:userId/follow
  Unfollow a user (protected)
*/
const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    // Delete follow relationship
    const result = await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'You are not following this user' });
    }

    res.json({ message: 'Successfully unfollowed user' });

  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

module.exports = {
  getUserProfile,
  getCurrentUserProfile,
  updateUserProfile,
  getUserVideos,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser
};