// profile.routes.js
import express from 'express';
import { getUserProfile } from '../controllers/profile.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);

export default router;
