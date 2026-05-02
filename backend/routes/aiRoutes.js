const express = require('express');
const { chatWithAI } = require('../controllers/aiController');
const { verifyJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyJWT);
router.post('/chat', chatWithAI);

module.exports = router;
