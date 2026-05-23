// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          📚 EduShare
        </Link>
              <div className="navbar-menu">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/discover" className="nav-link">Discover</Link>  {/* Add this */}
                  <Link to="/upload" className="nav-link">Upload</Link>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <span className="nav-username">{user?.username}</span>
                  <button onClick={handleLogout} className="logout-btn">
                      Logout
                  </button>
              </div>
      </div>
    </nav>
  );
}