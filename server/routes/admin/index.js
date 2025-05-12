console.log('[DEBUG] Top of server/routes/admin/index.js');

import express from 'express';
import { adminController } from '../../controllers/index.js';
console.log('[DEBUG] server/routes/admin/index.js: adminController import re-enabled. Value:', adminController ? 'loaded' : 'undefined/null');
// console.log('[DEBUG] server/routes/admin/index.js: adminController import commented out.');
import { protect, admin } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Protected admin routes
router.get('/users', protect, admin, adminController.getAllUsers);
router.get('/users/:id', protect, admin, adminController.getUserById);
router.put('/users/:id', protect, admin, adminController.updateUser);
router.delete('/users/:id', protect, admin, adminController.deleteUser);
console.log('[DEBUG] server/routes/admin/index.js: adminController routes re-enabled.');
// console.log('[DEBUG] server/routes/admin/index.js: adminController routes still commented out.');

export default router;
