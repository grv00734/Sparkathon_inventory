// server/routes/userRoutes.js

import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', authUser);

// @route   POST /api/users/register
// @desc    Register new user
router.post('/register', registerUser);

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
router.get('/profile', protect, getUserProfile);

export default router;
