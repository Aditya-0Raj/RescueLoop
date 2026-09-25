import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireRole } from '../middleware/auth.js';
import { getRecipients, getMyRecipient, updateCapacity, incomingDonations, acceptedDonations, acceptDonation, declineDonation } from '../controllers/recipientController.js';

const router = Router();
router.get('/', asyncHandler(getRecipients));
router.get('/me', requireRole('recipient'), asyncHandler(getMyRecipient));
router.patch('/me/capacity', requireRole('recipient'), asyncHandler(updateCapacity));
router.get('/me/incoming', requireRole('recipient'), asyncHandler(incomingDonations));
router.get('/me/accepted', requireRole('recipient'), asyncHandler(acceptedDonations));
router.post('/me/donations/:donationId/accept', requireRole('recipient'), asyncHandler(acceptDonation));
router.post('/me/donations/:donationId/decline', requireRole('recipient'), asyncHandler(declineDonation));
export default router;
