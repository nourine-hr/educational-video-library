// src/pages/MyLibrary.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import videoService from '../services/videoService';
import './MyLibrary.css';

export default function MyLibrary() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('all'); // all, video, audio

  useEffect(() => {
    fetchMyContent();
  }, []);

  const fetchMyContent = async () => {
    try {
      setLoading(true);
      const videosData = await userService.getUserVideos(user.id);
      setVideos(videosData.videos);

      // For audio, we'll filter from the videos list
      const audiosData = videosData.videos.filter(v => v.content_type === 'audio');
      setAudios(audiosData);
    } catch (err) {
      setError('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await videoService.deleteVideo(videoId);
        // Remove from list
        setVideos(prev => prev.filter(v => v.id !== videoId));
        setAudios(prev => prev.filter(v => v.id !== videoId));
      } catch (err) {
        alert('Failed to delete content');
      }
    }
  };

  // Filter content based on selected type
  let displayedContent = [];
  if (contentType === 'all') {
    displayedContent = videos;
  } else if (contentType === 'video') {
    displayedContent = videos.filter(v => v.content_type === 'video');
  } else if (contentType === 'audio') {
    displayedContent = videos.filter(v => v.content_type === 'audio');
  }

  if (loading) return <div className="library-loading">Loading your library...</div>;

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">My Library</h1>
        <p className="library-subtitle">Manage your educational content</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${contentType === 'all' ? 'active' : ''}`}
          onClick={() => setContentType('all')}
        >
          All ({videos.length})
        </button>
        <button 
          className={`filter-tab ${contentType === 'video' ? 'active' : ''}`}
          onClick={() => setContentType('video')}
        >
          📹 Videos ({videos.filter(v => v.content_type === 'video').length})
        </button>
        <button 
          className={`filter-tab ${contentType === 'audio' ? 'active' : ''}`}
          onClick={() => setContentType('audio')}
        >
          🎧 Audio ({videos.filter(v => v.content_type === 'audio').length})
        </button>
      </div>

      {/* Content Grid */}
      {displayedContent.length > 0 ? (
        <div className="library-grid">
          {displayedContent.map(content => (
            <div key={content.id} className="library-card">
              <div className="library-thumbnail">
                {content.content_type === 'video' ? (
                  <img 
                    src={content.thumbnail_url || 'https://via.placeholder.com/300x170'} 
                    alt={content.title}
                  />
                ) : (
                  <div className="audio-placeholder">🎵</div>
                )}
              </div>

              <div className="library-card-info">
                <h3 className="content-title">{content.title}</h3>
                <p className="content-meta">
                  🌐 {content.language} • {content.category}
                </p>
                <p className="content-stats">
                  👁️ {content.views_count} views
                </p>
              </div>

              <div className="library-card-actions">
                
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(content.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-content-message">
          <p>No {contentType === 'all' ? '' : contentType} content yet</p>
          <p>Start by <a href="/upload">uploading</a> your first content!</p>
        </div>
      )}
    </div>
  );
}