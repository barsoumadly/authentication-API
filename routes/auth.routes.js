import express from 'express';
import {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);

router.post('/login', login);
router.get('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
