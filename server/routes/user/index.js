import express from 'express';
import { userController } from '../../controllers';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Protected user routes
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.put('/change-password', protect, userController.changePassword);

export default router;
