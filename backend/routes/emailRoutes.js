const express = require('express');
const { z } = require('zod');
const { getInbox, getMessage, sendEmail, syncInbox, getOAuthUrl, oauthCallback } = require('../controllers/emailController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required')
});

// OAuth callback does not require JWT as it comes from Google redirect
router.get('/oauth/callback', oauthCallback);

router.use(verifyJWT);

router.get('/inbox', getInbox);
router.get('/oauth/url', getOAuthUrl);
router.post('/send', validateRequest(sendEmailSchema), sendEmail);
router.post('/sync', syncInbox);
router.get('/:id', getMessage);

module.exports = router;
