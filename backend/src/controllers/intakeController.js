import { parseDonationText } from '../services/aiService.js';
import { ApiError } from '../utils/apiError.js';

export async function parseIntake(req, res) {
  if (!req.body.message) throw new ApiError(400, 'message is required');
  const result = await parseDonationText(req.body.message);
  res.json({ success: true, data: result });
}
