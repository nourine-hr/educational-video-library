// src/index.js
/*
  This is the ENTRY POINT of the entire backend.
  When you run `npm run dev`, this file executes first.
  
  It creates an Express server and starts listening for requests.
*/
const express = require('express');
const cors = require('cors');
const videoRoutes = require('./routes/videos.routes');

require('dotenv').config();

// Import database (to verify connection works)
const pool = require('./config/database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====
// Middleware runs on EVERY request before it reaches routes

// Enable CORS (let frontend on 3000 talk to backend on 3001)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://educational-video-library-production.up.railway.app'  // Add your Vercel URL here
  ],
  credentials: true
}));
// Parse JSON requests (req.body contains JSON)
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// ===== TEST ROUTE =====
// This is just to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// ===== ROUTES =====
// In the ROUTES section, add:

const { authenticateToken } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/users.routes');
const savedVideoRoutes = require('./routes/savedvideos.routes');


app.use('/api/saved-videos', savedVideoRoutes);
app.use('/api/users', userRoutes);
app.get('/api/protected-test', authenticateToken, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    userId: req.user.id,
    email: req.user.email
  });
});

app.use('/api/videos', videoRoutes);
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);


// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});