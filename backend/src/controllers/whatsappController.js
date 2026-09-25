import env from '../config/env.js';
import { parseDonationText } from '../services/aiService.js';

export function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.whatsappVerifyToken) return res.status(200).send(challenge);
  return res.sendStatus(403);
}

export async function receiveWebhook(req, res) {
  // Meta expects a fast 200. Parsing is intentionally safe and side-effect free here;
  // a production adapter can persist the conversation and send a reply through Graph API.
  const entries = Array.isArray(req.body?.entry) ? req.body.entry : [];
  const messages = [];
  for (const entry of entries) {
    for (const change of entry.changes || []) {
      const incoming = change.value?.messages || [];
      for (const message of incoming) {
        if (message.type !== 'text' || !message.text?.body) continue;
        const parsed = await parseDonationText(message.text.body);
        messages.push({ from: message.from, id: message.id, text: message.text.body, parsed });
      }
    }
  }

  return res.status(200).json({ success: true, received: messages.length, messages });
}
