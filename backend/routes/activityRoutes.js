const express = require('express');
const { getActivities, markRead, markAllRead } = require('../controllers/activityController');
const { verifyJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyJWT);

router.get('/', getActivities);
router.patch('/:id/read', markRead);
router.post('/read-all', markAllRead);

module.exports = router;
