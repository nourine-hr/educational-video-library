const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./models/index');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://educational-video-library.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/videos.routes');
const userRoutes = require('./routes/users.routes');
const savedVideoRoutes = require('./routes/savedvideos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/saved-videos', savedVideoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});