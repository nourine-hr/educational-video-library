// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import videoService from '../services/videoService';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch all videos
      const videosResponse = await videoService.getAllVideos(1, 6, 'video');
      setVideos(videosResponse.content);

      // Fetch all audios
      const audiosResponse = await videoService.getAllVideos(1, 6, 'audio');
      setAudios(audiosResponse.content);
      
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.username}!</h1>
        <p className="dashboard-subtitle">Discover educational content from creators worldwide</p>
      </div>

      {/* Videos Section */}
      <section className="content-section">
        <h2 className="section-title">📹 Videos</h2>
        <div className="content-grid">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="content-card">
                <div className="content-thumbnail">
                  <img 
                    src={video.thumbnail_url || 'https://via.placeholder.com/300x170'} 
                    alt={video.title}
                  />
                  <span className="content-duration">{video.duration_seconds ? Math.floor(video.duration_seconds / 60) : 'N/A'}m</span>
                </div>
                <div className="content-info">
                  <h3 className="content-title">{video.title}</h3>
                  <p className="content-creator">By {video.creator_username}</p>
                  <p className="content-language">🌐 {video.language}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-content">No videos available</p>
          )}
        </div>
      </section>

      {/* Audios Section */}
      <section className="content-section">
        <h2 className="section-title">🎧 Audio Content</h2>
        <div className="content-grid">
          {audios.length > 0 ? (
            audios.map((audio) => (
              <div key={audio.id} className="content-card">
                <div className="content-thumbnail audio-thumbnail">
                  <div className="audio-icon">🎵</div>
                </div>
                <div className="content-info">
                  <h3 className="content-title">{audio.title}</h3>
                  <p className="content-creator">By {audio.creator_username}</p>
                  <p className="content-language">🌐 {audio.language}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-content">No audio content available</p>
          )}
        </div>
      </section>
    </div>
  );
}