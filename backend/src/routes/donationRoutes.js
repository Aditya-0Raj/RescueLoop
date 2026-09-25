import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authOptional, requireRole } from '../middleware/auth.js';
import { createDonation, getDonationById, getMyDonations } from '../controllers/donationController.js';

const router = Router();
router.use(authOptional);
router.post('/', requireRole('donor'), asyncHandler(createDonation));
router.get('/my', requireRole('donor'), asyncHandler(getMyDonations));
router.get('/:id', asyncHandler(getDonationById));
export default router;
