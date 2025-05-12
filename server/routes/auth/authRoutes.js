import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  // getUserProfile, // Add later when needed
} from '../../controllers/auth/authController.js';
import { validate } from '../../middleware/validation/validationMiddleware.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validations/authValidations.js';

const router = express.Router();

// Apply rate limiting to auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all auth routes
router.use(authLimiter);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validate(loginSchema), loginUser);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify user email
 * @access  Public
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// Example of a protected route (add later)
// router.route('/profile')
//   .get(protect, getUserProfile);

export default router;
