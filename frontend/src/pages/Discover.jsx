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
    
    // Fetch real users from backend
    // Temporarily, we'll fetch user 1, 2, 3
    const userIds = [1, 2, 3];
    const fetchedCreators = [];
    
    for (const id of userIds) {
      try {
        const userData = await userService.getUserProfile(id);
        fetchedCreators.push(userData);
      } catch (err) {
        console.error(`Failed to fetch user ${id}:`, err);
      }
    }
    
    setCreators(fetchedCreators);
  } catch (err) {
    console.error('Error fetching creators:', err);
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