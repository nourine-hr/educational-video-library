// src/pages/Upload.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import videoService from '../services/videoService';
import './Upload.css';

export default function Upload() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [contentType, setContentType] = useState('video');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'English',
    category: '',
    duration_seconds: '',
    video_url: '',
    audio_url: '',
    thumbnail_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.category) {
        setError('Title and category are required');
        setLoading(false);
        return;
      }

      if (contentType === 'video' && !formData.video_url) {
        setError('Video URL is required');
        setLoading(false);
        return;
      }

      if (contentType === 'audio' && !formData.audio_url) {
        setError('Audio URL is required');
        setLoading(false);
        return;
      }

      // Prepare data to send
      const dataToSend = {
        ...formData,
        content_type: contentType,
        duration_seconds: formData.duration_seconds ? parseInt(formData.duration_seconds) : null
      };

      // Remove unnecessary URLs
      if (contentType === 'video') {
        delete dataToSend.audio_url;
      } else {
        delete dataToSend.video_url;
      }

      await videoService.createVideo(dataToSend);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Failed to upload content');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    'English',
    'Spanish',
    'French',
    'Mandarin',
    'Arabic',
    'German',
    'Portuguese',
    'Japanese',
    'Italian',
    'Korean'
  ];

  const categories = [
    'Mathematics',
    'Science',
    'Languages',
    'History',
    'Literature',
    'Technology',
    'Arts',
    'Music',
    'Sports',
    'Other'
  ];

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1 className="upload-title">Upload Content</h1>
        
        {error && <div className="error-message">{error}</div>}

        {/* Content Type Selector */}
        <div className="content-type-selector">
          <label className="type-option">
            <input
              type="radio"
              value="video"
              checked={contentType === 'video'}
              onChange={(e) => setContentType(e.target.value)}
            />
            <span className="type-label">📹 Video</span>
          </label>
          <label className="type-option">
            <input
              type="radio"
              value="audio"
              checked={contentType === 'audio'}
              onChange={(e) => setContentType(e.target.value)}
            />
            <span className="type-label">🎧 Audio</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Describe your content..."
              rows="4"
            />
          </div>

          {/* Language */}
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="form-input"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="form-group">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              id="duration"
              type="number"
              name="duration_seconds"
              value={formData.duration_seconds}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., 3600 for 1 hour"
            />
          </div>

          {/* Video URL (only show for video) */}
          {contentType === 'video' && (
            <div className="form-group">
              <label htmlFor="videoUrl">Video URL *</label>
              <input
                id="videoUrl"
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://example.com/video.mp4"
                required
              />
              <p className="form-hint">Upload your video to Cloudinary first, then paste the URL</p>
            </div>
          )}

          {/* Audio URL (only show for audio) */}
          {contentType === 'audio' && (
            <div className="form-group">
              <label htmlFor="audioUrl">Audio URL *</label>
              <input
                id="audioUrl"
                type="url"
                name="audio_url"
                value={formData.audio_url}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://example.com/audio.mp3"
                required
              />
              <p className="form-hint">Upload your audio to Cloudinary first, then paste the URL</p>
            </div>
          )}

          {/* Thumbnail URL */}
          <div className="form-group">
            <label htmlFor="thumbnailUrl">Thumbnail URL</label>
            <input
              id="thumbnailUrl"
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com/thumbnail.jpg"
            />
            <p className="form-hint">Optional: An image to display as the thumbnail</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="upload-button"
            disabled={loading}
          >
            {loading ? 'Uploading...' : `Upload ${contentType === 'video' ? 'Video' : 'Audio'}`}
          </button>
        </form>
      </div>
    </div>
  );
}

import { Navigate } from 'react-router-dom';