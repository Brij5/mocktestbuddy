console.log('[DEBUG_HEALTH_ROUTES] Top of server/routes/health/healthRoutes.js');
import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    message: 'API is healthy and responsive',
  });
});

export default router;
