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
  const [savedVideoIds, setSavedVideoIds] = useState(new Set()); // Track saved videos
const [contentTab, setContentTab] = useState('all');
  useEffect(() => {
    fetchContent();
    fetchSavedVideos();
  }, []);

  const fetchSavedVideos = async () => {
    try {
      const data = await videoService.getSavedVideos();
      const ids = new Set(data.savedVideos.map(v => v.id));
      setSavedVideoIds(ids);
    } catch (err) {
      console.error('Failed to load saved videos');
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const videosResponse = await videoService.getAllVideos(1, 6, 'video');
      setVideos(videosResponse.content);

      const audiosResponse = await videoService.getAllVideos(1, 6, 'audio');
      setAudios(audiosResponse.content);
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVideo = async (videoId) => {
    try {
      await videoService.saveVideo(videoId);
      setSavedVideoIds(prev => new Set([...prev, videoId]));
      alert('Video saved!');
    } catch (err) {
      alert('Failed to save video: ' + err.error);
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
                  <button 
                    onClick={() => handleSaveVideo(video.id)}
                    className={`save-btn ${savedVideoIds.has(video.id) ? 'saved' : ''}`}
                  >
                    {savedVideoIds.has(video.id) ? '✓ Saved' : 'Save'}
                  </button>
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
                  <button 
                    onClick={() => handleSaveVideo(audio.id)}
                    className={`save-btn ${savedVideoIds.has(audio.id) ? 'saved' : ''}`}
                  >
                    {savedVideoIds.has(audio.id) ? '✓ Saved' : 'Save'}
                  </button>
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