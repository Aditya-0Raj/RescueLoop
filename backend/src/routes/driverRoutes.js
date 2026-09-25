import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireRole } from '../middleware/auth.js';
import { getMyDriver, updateDuty, getJobs, getHistory, acceptJob, declineJob } from '../controllers/driverController.js';

const router = Router();
router.get('/me', requireRole('driver'), asyncHandler(getMyDriver));
router.patch('/me/duty', requireRole('driver'), asyncHandler(updateDuty));
router.get('/me/jobs', requireRole('driver'), asyncHandler(getJobs));
router.get('/me/history', requireRole('driver'), asyncHandler(getHistory));
router.post('/me/jobs/:rescueId/accept', requireRole('driver'), asyncHandler(acceptJob));
router.post('/me/jobs/:rescueId/decline', requireRole('driver'), asyncHandler(declineJob));
export default router;
