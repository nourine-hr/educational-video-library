// src/pages/Discover.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './Discover.css';

export default function Discover() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      // For now, we'll use a simple approach
      // In production, we'd have a /api/users endpoint that returns all users
      // For now, just show a message
      setCreators([
        {
          id: 1,
          username: 'math_teacher',
          bio: 'Teaching mathematics to students worldwide',
          profile_image_url: null,
          followers_count: 245,
          videos_count: 12
        },
        {
          id: 2,
          username: 'spanish_teacher',
          bio: 'Spanish language expert',
          profile_image_url: null,
          followers_count: 189,
          videos_count: 8
        },
        {
          id: 3,
          username: 'english_teacher',
          bio: 'English literature and composition',
          profile_image_url: null,
          followers_count: 312,
          videos_count: 15
        }
      ]);
    } catch (err) {
      setError('Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator =>
    creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (userId) => {
    navigate(`/creator/${userId}`);
  };

  if (loading) return <div className="discover-loading">Loading creators...</div>;
  if (error) return <div className="discover-error">{error}</div>;

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1 className="discover-title">Discover Creators</h1>
        <p className="discover-subtitle">Find educators and learners to follow</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search creators by name or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Creators Grid */}
      <div className="creators-grid">
        {filteredCreators.length > 0 ? (
          filteredCreators.map(creator => (
            <div key={creator.id} className="creator-card">
              <div className="creator-avatar">
                {creator.profile_image_url ? (
                  <img src={creator.profile_image_url} alt={creator.username} />
                ) : (
                  <div className="avatar-placeholder">{creator.username?.[0].toUpperCase()}</div>
                )}
              </div>

              <h3 className="creator-username">@{creator.username}</h3>
              <p className="creator-bio">{creator.bio}</p>

              <div className="creator-stats">
                <div className="stat-item">
                  <span className="stat-value">{creator.followers_count}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{creator.videos_count}</span>
                  <span className="stat-label">Content</span>
                </div>
              </div>

              <button 
                className="view-profile-btn"
                onClick={() => handleViewProfile(creator.id)}
              >
                View Profile
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            No creators found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}