const { SavedVideo, Video, User } = require('../models/index');

const getSavedVideos = async (req, res) => {
  try {
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
    const saved = await SavedVideo.findOne({
      user_id: req.user.id,
      video_id: req.params.videoId
    });
    res.json({ isSaved: !!saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check save status' });
  }
};

module.exports = { getSavedVideos, saveVideo, unsaveVideo, isVideoSaved };