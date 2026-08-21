const { Video, User } = require('../models/index');

const getAllVideos = async (req, res) => {
  try {
    const { type, page = 1, limit = 6 } = req.query;
    
    const query = type ? { content_type: type } : {};
    const skip = (page - 1) * limit;

    const videos = await Video.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    // Add creator username
    const videosWithCreator = await Promise.all(
      videos.map(async (video) => {
        const creator = await User.findById(video.creator_id).select('username');
        return {
          ...video,
          creator_username: creator?.username || 'Unknown'
        };
      })
    );

    res.json({ content: videosWithCreator });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

const getVideosByCreator = async (req, res) => {
  try {
    const videos = await Video.find({ creator_id: req.params.creatorId });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, language, category, content_type, video_url, audio_url, thumbnail_url, duration_seconds } = req.body;

    const video = await Video.create({
      creator_id: req.user.id,
      title,
      description,
      language,
      category,
      content_type,
      video_url,
      audio_url,
      thumbnail_url,
      duration_seconds
    });

    res.json({ video });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create video' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

const getSavedVideos = async (req, res) => {
  try {
    const { SavedVideo } = require('../models/index');
    const saved = await SavedVideo.find({ user_id: req.user.id });
    
    const videos = await Promise.all(
      saved.map(s => Video.findById(s.video_id))
    );

    const videosWithCreator = await Promise.all(
      videos.map(async (video) => {
        const creator = await User.findById(video.creator_id).select('username');
        return {
          ...video.toObject(),
          creator_username: creator?.username || 'Unknown'
        };
      })
    );

    res.json({ savedVideos: videosWithCreator });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved videos' });
  }
};

const saveVideo = async (req, res) => {
  try {
    const { SavedVideo } = require('../models/index');
    await SavedVideo.create({
      user_id: req.user.id,
      video_id: req.params.videoId
    });
    res.json({ message: 'Video saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save video' });
  }
};

const unsaveVideo = async (req, res) => {
  try {
    const { SavedVideo } = require('../models/index');
    await SavedVideo.deleteOne({
      user_id: req.user.id,
      video_id: req.params.videoId
    });
    res.json({ message: 'Video removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove video' });
  }
};

const isVideoSaved = async (req, res) => {
  try {
    const { SavedVideo } = require('../models/index');
    const saved = await SavedVideo.findOne({
      user_id: req.user.id,
      video_id: req.params.videoId
    });
    res.json({ isSaved: !!saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check save status' });
  }
};

module.exports = { getAllVideos, getVideoById, getVideosByCreator, createVideo, updateVideo, deleteVideo, getSavedVideos, saveVideo, unsaveVideo, isVideoSaved };