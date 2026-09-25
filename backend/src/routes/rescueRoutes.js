import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listRescues, getRescue, failover, timeline } from '../controllers/rescueController.js';
import { pickupOtp, verifyPickup, deliveryOtp, verifyDelivery } from '../controllers/trackingController.js';

const router = Router();
router.get('/', requireRole('operations'), asyncHandler(listRescues));
router.get('/:id', asyncHandler(getRescue));
router.get('/:id/timeline', asyncHandler(timeline));
router.post('/:id/failover', asyncHandler(failover));
router.post('/:id/pickup/otp', asyncHandler(pickupOtp));
router.post('/:id/pickup/verify', asyncHandler(verifyPickup));
router.post('/:id/delivery/otp', asyncHandler(deliveryOtp));
router.post('/:id/delivery/verify', asyncHandler(verifyDelivery));
export default router;
