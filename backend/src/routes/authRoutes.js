import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authOptional, requireAuth } from '../middleware/auth.js';
import { demoLogin, me } from '../controllers/authController.js';

const router = Router();
router.post('/demo-login', asyncHandler(demoLogin));
router.get('/me', authOptional, requireAuth, asyncHandler(me));
export default router;
