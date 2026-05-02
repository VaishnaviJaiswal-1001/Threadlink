const express = require('express');
const { z } = require('zod');
const { getProfile, updateProfile, uploadAvatar, deleteAccount } = require('../controllers/userController');
const { verifyJWT } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional()
});

router.use(verifyJWT);

router.get('/profile', getProfile);
router.put('/update', validateRequest(updateProfileSchema), updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.delete('/account', deleteAccount);

module.exports = router;
