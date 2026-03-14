import express from 'express';
import { register, login } from './auth.controller.js';
import protect from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route - test middleware
router.get('/me', protect, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

export default router;