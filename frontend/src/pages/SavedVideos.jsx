// src/pages/SavedVideos.jsx
import { useState, useEffect } from 'react';
import videoService from '../services/videoService';
import './SavedVideos.css';

export default function SavedVideos() {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  const fetchSavedVideos = async () => {
    try {
      setLoading(true);
      const data = await videoService.getSavedVideos();
      setSavedVideos(data.savedVideos || []);
    } catch (err) {
      setError('Failed to load saved videos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (videoId) => {
    if (window.confirm('Remove this video from your library?')) {
      try {
        await videoService.unsaveVideo(videoId);
        setSavedVideos(prev => prev.filter(v => v.id !== videoId));
      } catch (err) {
        alert('Failed to remove video');
      }
    }
  };

  if (loading) return <div className="saved-loading">Loading saved videos...</div>;

  return (
    <div className="saved-container">
      <div className="saved-header">
        <h1 className="saved-title">Saved Videos</h1>
        <p className="saved-subtitle">Your curated collection of educational content</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {savedVideos.length > 0 ? (
        <div className="saved-grid">
          {savedVideos.map(video => (
            <div key={video.id} className="saved-card">
              <div className="saved-thumbnail">
                <img 
                  src={video.thumbnail_url || 'https://via.placeholder.com/300x170'} 
                  alt={video.title}
                />
                <div className="saved-badge">✓ Saved</div>
              </div>

              <div className="saved-info">
                <h3 className="saved-title-card">{video.title}</h3>
                <p className="saved-creator">By {video.creator_username}</p>
                <p className="saved-meta">
                  🌐 {video.language} • {video.category}
                </p>
              </div>

              <div className="saved-actions">
                <button className="view-btn">View</button>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemove(video.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-saved-message">
          <p>No saved videos yet</p>
          <p>Browse the <a href="/dashboard">dashboard</a> and save videos you like!</p>
        </div>
      )}
    </div>
  );
}