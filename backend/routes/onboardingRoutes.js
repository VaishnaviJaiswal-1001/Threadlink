const express = require('express');
const { z } = require('zod');
const { getStatus, saveSelectedApps, connectApp, savePhone, completeOnboarding } = require('../controllers/onboardingController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const selectAppsSchema = z.object({
  apps: z.array(z.enum(['gmail', 'gcal'])).min(1, 'Select at least one app')
});

const connectAppSchema = z.object({
  appId: z.enum(['gmail', 'gcal'])
});

const phoneSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number with country code')
});

router.use(verifyJWT);

router.get('/status', getStatus);
router.post('/apps/select', validateRequest(selectAppsSchema), saveSelectedApps);
router.post('/apps/connect', validateRequest(connectAppSchema), connectApp);
router.post('/phone', validateRequest(phoneSchema), savePhone);
router.post('/complete', completeOnboarding);

module.exports = router;
