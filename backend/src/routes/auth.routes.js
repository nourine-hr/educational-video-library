// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup: POST /api/auth/signup
router.post('/signup', authController.signup);

// Login: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;