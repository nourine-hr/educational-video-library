const { User, Video, Follow } = require('../models/index');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followersCount = await Follow.countDocuments({ following_id: req.params.userId });
    const followingCount = await Follow.countDocuments({ follower_id: req.params.userId });
    const videosCount = await Video.countDocuments({ creator_id: req.params.userId });

    res.json({
      ...user.toObject(),
      followers_count: followersCount,
      following_count: followingCount,
      videos_count: videosCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
      profile_image_url: user.profile_image_url
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { first_name: firstName, last_name: lastName, bio },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ creator_id: req.params.userId });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

const getFollowers = async (req, res) => {
  try {
    const follows = await Follow.find({ following_id: req.params.userId });
    const followerIds = follows.map(f => f.follower_id);
    const followers = await User.find({ _id: { $in: followerIds } });
    res.json({ followers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
};

const getFollowing = async (req, res) => {
  try {
    const follows = await Follow.find({ follower_id: req.params.userId });
    const followingIds = follows.map(f => f.following_id);
    const following = await User.find({ _id: { $in: followingIds } });
    res.json({ following });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch following' });
  }
};

const followUser = async (req, res) => {
  try {
    await Follow.create({
      follower_id: req.user.id,
      following_id: req.params.userId
    });
    res.json({ message: 'Following user' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    await Follow.deleteOne({
      follower_id: req.user.id,
      following_id: req.params.userId
    });
    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

module.exports = { getUserProfile, getCurrentUserProfile, updateUserProfile, getUserVideos, getFollowers, getFollowing, followUser, unfollowUser };