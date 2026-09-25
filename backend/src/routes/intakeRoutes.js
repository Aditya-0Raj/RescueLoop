import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseIntake } from '../controllers/intakeController.js';

const router = Router();
router.post('/parse', asyncHandler(parseIntake));
export default router;
