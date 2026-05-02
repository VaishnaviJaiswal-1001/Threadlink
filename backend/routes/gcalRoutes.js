const express = require('express');
const { getEvents } = require('../controllers/gcalController');
const { verifyJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyJWT);
router.get('/events', getEvents);

module.exports = router;
