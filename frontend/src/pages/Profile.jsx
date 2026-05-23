// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getCurrentUserProfile();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile(user.id, {
        firstName: formData.first_name,
        lastName: formData.last_name,
        bio: formData.bio
      });
      setProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile');
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!profile) return <div className="profile-error">Failed to load profile</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.profile_image_url ? (
              <img src={profile.profile_image_url} alt={profile.username} />
            ) : (
              <div className="avatar-placeholder">{profile.username?.[0].toUpperCase()}</div>
            )}
          </div>
          <div className="profile-meta">
            <h1 className="profile-name">@{profile.username}</h1>
            <p className="profile-email">{profile.email}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="profile-edit-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="form-input"
                rows="4"
              />
            </div>
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-view">
            <div className="profile-info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{profile.first_name} {profile.last_name}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Bio:</span>
              <span className="info-value">{profile.bio || 'No bio yet'}</span>
            </div>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">0</span>
            <span className="stat-label">Videos</span>
          </div>
          <div className="stat">
            <span className="stat-value">0</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">0</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}