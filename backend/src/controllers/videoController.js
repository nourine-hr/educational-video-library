// src/controllers/videoController.js
/*
  Controllers contain the BUSINESS LOGIC.
  
  The flow is:
  1. Route receives request
  2. Route calls controller function
  3. Controller queries database
  4. Controller returns response
  
  Separating routes from logic keeps code organized.
*/

const pool = require('../config/database');

// GET /api/videos
// Returns all public videos
const getAllVideos = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const contentType = req.query.type || null; // Optional: filter by type

    // Build WHERE clause
    let whereClause = 'v.is_public = true';
    let countWhereClause = 'is_public = true';
    let params = [];

    if (contentType) {
      whereClause += ' AND v.content_type = $1';
      countWhereClause += ' AND content_type = $1';
      params.push(contentType);
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM videos WHERE ${countWhereClause}`,
      params
    );
    const totalVideos = parseInt(countResult.rows[0].count);

    // Get videos
    const paramIndex = contentType ? 2 : 1;
    const result = await pool.query(`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.language,
        v.content_type,
        v.video_url,
        v.audio_url,
        v.thumbnail_url,
        v.duration_seconds,
        v.category,
        v.views_count,
        v.created_at,
        u.id as creator_id,
        u.username as creator_username,
        u.profile_image_url as creator_image
      FROM videos v
      JOIN users u ON v.creator_id = u.id
      WHERE ${whereClause}
      ORDER BY v.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    res.json({
      content: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalVideos,
        pages: Math.ceil(totalVideos / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

// GET /api/videos/:id
// Returns single video with creator info
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
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
        u.bio as creator_bio,
        u.profile_image_url as creator_image
      FROM videos v
      JOIN users u ON v.creator_id = u.id
      WHERE v.id = $1 AND v.is_public = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

// GET /api/videos/creator/:creatorId
// Returns all videos from a specific creator
const getVideosByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const offset = (page - 1) * limit;
    
    // Get creator info
    const creatorResult = await pool.query(
      'SELECT id, username, bio, profile_image_url FROM users WHERE id = $1',
      [creatorId]
    );
    
    if (creatorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    
    // Get creator's videos
    const videosResult = await pool.query(`
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
    `, [creatorId, limit, offset]);
    
    // Count total videos
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM videos WHERE creator_id = $1 AND is_public = true',
      [creatorId]
    );
    
    res.json({
      creator: creatorResult.rows[0],
      videos: videosResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching creator videos:', error);
    res.status(500).json({ error: 'Failed to fetch creator videos' });
  }
};

// ADD THIS to videoController.js

const createVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      title, 
      description, 
      language, 
      video_url, 
      audio_url,
      thumbnail_url, 
      category, 
      duration_seconds,
      content_type = 'video'  // Default to video
    } = req.body;

    // Validate required fields
    if (!title || !language || !category) {
      return res.status(400).json({ 
        error: 'Title, language, and category are required' 
      });
    }

    // Validate content_type
    if (!['video', 'audio'].includes(content_type)) {
      return res.status(400).json({ 
        error: 'content_type must be "video" or "audio"' 
      });
    }

    // Validate URLs based on content type
    if (content_type === 'video' && !video_url) {
      return res.status(400).json({ 
        error: 'video_url is required for video content' 
      });
    }

    if (content_type === 'audio' && !audio_url) {
      return res.status(400).json({ 
        error: 'audio_url is required for audio content' 
      });
    }

    // Insert into database
    const result = await pool.query(`
      INSERT INTO videos (
        creator_id,
        title,
        description,
        language,
        content_type,
        video_url,
        audio_url,
        thumbnail_url,
        category,
        duration_seconds,
        is_public
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      userId,
      title,
      description || null,
      language,
      content_type,
      video_url || null,
      audio_url || null,
      thumbnail_url || null,
      category || null,
      duration_seconds || null,
      true  // is_public
    ]);

    const newContent = result.rows[0];

    res.status(201).json({
      message: `${content_type} created successfully`,
      content: {
        id: newContent.id,
        title: newContent.title,
        language: newContent.language,
        content_type: newContent.content_type,
        creator_id: newContent.creator_id,
        created_at: newContent.created_at
      }
    });

  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, language, category, audio_url, video_url } = req.body;

    // Check if content exists and user owns it
    const checkResult = await pool.query(
      'SELECT creator_id, content_type FROM videos WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (checkResult.rows[0].creator_id !== userId) {
      return res.status(403).json({ error: 'You can only edit your own content' });
    }

    // Update content
    const result = await pool.query(`
      UPDATE videos
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        language = COALESCE($3, language),
        category = COALESCE($4, category),
        audio_url = COALESCE($5, audio_url),
        video_url = COALESCE($6, video_url),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [title, description, language, category, audio_url, video_url, id]);

    res.json({
      message: 'Content updated successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if video exists and user owns it
    const checkResult = await pool.query(
      'SELECT creator_id FROM videos WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (checkResult.rows[0].creator_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own videos' });
    }

    // Delete video
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  getVideosByCreator,
  createVideo,
  updateVideo,
  deleteVideo
};