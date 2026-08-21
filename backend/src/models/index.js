const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password_hash: String,
  first_name: String,
  last_name: String,
  bio: String,
  profile_image_url: String,
  is_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const videoSchema = new mongoose.Schema({
  creator_id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  language: { type: String, default: 'English' },
  content_type: { type: String, default: 'video' },
  video_url: String,
  audio_url: String,
  thumbnail_url: String,
  duration_seconds: Number,
  category: String,
  views_count: { type: Number, default: 0 },
  is_public: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const followSchema = new mongoose.Schema({
  follower_id: mongoose.Schema.Types.ObjectId,
  following_id: mongoose.Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now }
});

const savedVideoSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  video_id: mongoose.Schema.Types.ObjectId,
  saved_at: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Video: mongoose.model('Video', videoSchema),
  Follow: mongoose.model('Follow', followSchema),
  SavedVideo: mongoose.model('SavedVideo', savedVideoSchema),
  connectDB: async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
    }
  }
};