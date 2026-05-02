const express = require('express');
const { z } = require('zod');
const { getStatus, saveSelectedApps, connectApp, completeOnboarding } = require('../controllers/onboardingController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const selectAppsSchema = z.object({
  apps: z.array(z.enum(['gmail', 'slack', 'gcal', 'gdrive'])).min(1, 'Select at least one app')
});

const connectAppSchema = z.object({
  appId: z.enum(['gmail', 'slack', 'gcal', 'gdrive'])
});

router.use(verifyJWT);

router.get('/status', getStatus);
router.post('/apps/select', validateRequest(selectAppsSchema), saveSelectedApps);
router.post('/apps/connect', validateRequest(connectAppSchema), connectApp);
router.post('/complete', completeOnboarding);

module.exports = router;
