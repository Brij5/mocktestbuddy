import express from 'express';
const router = express.Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'MongoDB',
    version: process.env.npm_package_version
  });
});

export default router;
