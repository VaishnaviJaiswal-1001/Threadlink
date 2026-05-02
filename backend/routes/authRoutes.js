const express = require('express');
const passport = require('passport');
const { z } = require('zod');
const { signup, login, logout, refresh, googleCallback, getMe, updateProfile } = require('../controllers/authController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  autoReplyEnabled: z.boolean().optional()
});

router.post('/signup', authLimiter, validateRequest(signupSchema), signup);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/logout', verifyJWT, logout);
router.post('/refresh', validateRequest(refreshSchema), refresh);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false, prompt: 'select_account' }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR || 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const { uploadResume } = require('../controllers/authController');

router.get('/me', verifyJWT, getMe);
router.patch('/profile', verifyJWT, validateRequest(profileUpdateSchema), updateProfile);
router.post('/resume', verifyJWT, upload.single('resume'), uploadResume);

module.exports = router;
