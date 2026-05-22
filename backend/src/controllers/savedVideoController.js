// src/controllers/savedVideoController.js
const pool = require('../config/database');

/*
  GET /api/saved-videos
  Get all videos saved by current user (protected)
*/
const getSavedVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const offset = (page - 1) * limit;

    // Get saved videos with creator info
    const result = await pool.query(`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.language,
        v.video_url,
        v.thumbnail_url,
        v.duration_seconds,
        v.category,
        v.views_count,
        v.created_at,
        u.id as creator_id,
        u.username as creator_username,
        u.profile_image_url as creator_image,
        sv.saved_at
      FROM saved_videos sv
      JOIN videos v ON sv.video_id = v.id
      JOIN users u ON v.creator_id = u.id
      WHERE sv.user_id = $1 AND v.is_public = true
      ORDER BY sv.saved_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM saved_videos WHERE user_id = $1',
      [userId]
    );

    res.json({
      savedVideos: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching saved videos:', error);
    res.status(500).json({ error: 'Failed to fetch saved videos' });
  }
};

/*
  POST /api/saved-videos/:videoId
  Save a video to library (protected)
*/
const saveVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;

    // Check if video exists
    const videoCheck = await pool.query(
      'SELECT id FROM videos WHERE id = $1 AND is_public = true',
      [videoId]
    );

    if (videoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if already saved
    const savedCheck = await pool.query(
      'SELECT id FROM saved_videos WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    if (savedCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Video already saved' });
    }

    // Save video
    await pool.query(
      'INSERT INTO saved_videos (user_id, video_id) VALUES ($1, $2)',
      [userId, videoId]
    );

    res.status(201).json({ message: 'Video saved successfully' });

  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Failed to save video' });
  }
};

/*
  DELETE /api/saved-videos/:videoId
  Remove saved video from library (protected)
*/
const removeSavedVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;

    const result = await pool.query(
      'DELETE FROM saved_videos WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Saved video not found' });
    }

    res.json({ message: 'Video removed from saved' });

  } catch (error) {
    console.error('Error removing saved video:', error);
    res.status(500).json({ error: 'Failed to remove video' });
  }
};

/*
  GET /api/saved-videos/:videoId/is-saved
  Check if current user has saved this video (protected)
*/
const isVideoSaved = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;

    const result = await pool.query(
      'SELECT id FROM saved_videos WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    res.json({
      isSaved: result.rows.length > 0
    });

  } catch (error) {
    console.error('Error checking saved video:', error);
    res.status(500).json({ error: 'Failed to check' });
  }
};

module.exports = {
  getSavedVideos,
  saveVideo,
  removeSavedVideo,
  isVideoSaved
};