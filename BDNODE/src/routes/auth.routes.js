import express from 'express';
import { login, logout, checkEmailExists, register } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.post('/check-email', checkEmailExists);

export default router;
