console.log('[DEBUG_USER_ROUTES] Top of server/routes/user/userRoutes.js'); 
import express from 'express';
import { 
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile, 
  updateUserProfile 
} from '../../controllers/userController.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected Routes
router.route('/profile')
  .get(protect, getUserProfile)       // Get user profile (needs auth)
  .put(protect, updateUserProfile);   // Update user profile (needs auth)

export default router;
