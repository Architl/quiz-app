import express from 'express';
import { register, verifyEmail, forgotPassword, resetPassword, resendOtp, login, getProfile } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

//public routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

//protected routes
router.get('/profile', auth, getProfile);

export default router;