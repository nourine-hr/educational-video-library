// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Discover from './pages/Discover';
import CreatorProfile from './pages/CreatorProfile';


// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div style={{textAlign: 'center', padding: '40px'}}>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />  {/* Add navbar */}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes (no navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes (with navbar) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/upload" 
            element={
             <ProtectedRoute>
              <Upload />
             </ProtectedRoute>
            } 
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            }
          />

          <Route
            path="/creator/:userId"
            element={
              <ProtectedRoute>
                <CreatorProfile />
              </ProtectedRoute>
            }
          />
          
          
          {/* Redirect home to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;