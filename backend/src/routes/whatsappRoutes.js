import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { receiveWebhook, verifyWebhook } from '../controllers/whatsappController.js';

const router = Router();
router.get('/webhook', verifyWebhook);
router.post('/webhook', asyncHandler(receiveWebhook));
export default router;
