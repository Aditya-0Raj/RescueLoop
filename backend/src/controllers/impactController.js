import { getImpactDashboard } from '../services/impactService.js';

export async function dashboard(_req, res) {
  const data = await getImpactDashboard();
  res.json({ success: true, data });
}
