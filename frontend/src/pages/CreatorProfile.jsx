// src/pages/CreatorProfile.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import videoService from '../services/videoService';
import './CreatorProfile.css';

export default function CreatorProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreatorData();
  }, [userId]);

  const fetchCreatorData = async () => {
    try {
      setLoading(true);
      const creatorData = await userService.getUserProfile(userId);
      setCreator(creatorData);

      const videosData = await userService.getUserVideos(userId);
      setVideos(videosData.videos);

      // Check if current user follows this creator
      // For now, set to false
      setIsFollowing(false);
    } catch (err) {
      setError('Failed to load creator profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
  try {
    if (isFollowing) {
      await userService.unfollowUser(userId);
      setCreator(prev => ({
        ...prev,
        followers_count: prev.followers_count - 1
      }));
    } else {
      await userService.followUser(userId);
      setCreator(prev => ({
        ...prev,
        followers_count: prev.followers_count + 1
      }));
    }
    setIsFollowing(!isFollowing);
  } catch (err) {
    console.error('Failed to toggle follow');
  }
};

  if (loading) return <div className="creator-loading">Loading...</div>;
  if (error || !creator) return <div className="creator-error">{error}</div>;

  // Don't show follow button for own profile
  const isOwnProfile = currentUser?.id === parseInt(userId);

  return (
    <div className="creator-profile-container">
      {/* Header Section */}
      <div className="creator-header">
        <div className="creator-cover">
          <div className="cover-placeholder"></div>
        </div>

        <div className="creator-info-section">
          <div className="creator-avatar-large">
            {creator.profile_image_url ? (
              <img src={creator.profile_image_url} alt={creator.username} />
            ) : (
              <div className="avatar-large-placeholder">{creator.username?.[0].toUpperCase()}</div>
            )}
          </div>

          <div className="creator-meta">
            <h1 className="creator-name">@{creator.username}</h1>
            <p className="creator-full-name">
              {creator.first_name} {creator.last_name}
            </p>
            <p className="creator-bio-large">{creator.bio || 'No bio yet'}</p>

            {!isOwnProfile && (
              <button 
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="creator-stats-large">
        <div className="stat-box">
          <span className="stat-value-large">{videos.length}</span>
          <span className="stat-label-large">Videos</span>
        </div>
        <div className="stat-box">
          <span className="stat-value-large">{creator.followers_count || 0}</span>
          <span className="stat-label-large">Followers</span>
        </div>
        <div className="stat-box">
          <span className="stat-value-large">{creator.following_count || 0}</span>
          <span className="stat-label-large">Following</span>
        </div>
      </div>

      {/* Videos Section */}
      <div className="creator-videos-section">
        <h2 className="videos-title">Educational Content</h2>

        {videos.length > 0 ? (
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  <img 
                    src={video.thumbnail_url || 'https://via.placeholder.com/300x170'} 
                    alt={video.title}
                  />
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-language">🌐 {video.language}</p>
                  <p className="video-category">{video.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-videos">
            This creator hasn't uploaded any videos yet
          </div>
        )}
      </div>
    </div>
  );
}