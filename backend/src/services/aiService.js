import env from '../config/env.js';

function regexParse(message) {
  const text = String(message || '').trim();
  const quantityMatch = text.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilogram|kilograms|portion|portions|box|boxes|piece|pieces)/i);
  const safeUntilMatch = text.match(/(?:safe|good|usable)\s*(?:till|until|up to)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  const foodType = /non[- ]?veg|chicken|mutton|fish|egg/i.test(text)
    ? 'Non-vegetarian meals'
    : /bakery|bread|cake|pastry/i.test(text)
      ? 'Bakery'
      : /packaged|sealed/i.test(text)
        ? 'Packaged'
        : 'Veg meals';

  return {
    foodName: text.replace(quantityMatch?.[0] || '', '').replace(safeUntilMatch?.[0] || '', '').replace(/\s+/g, ' ').trim() || 'Surplus food',
    foodType,
    quantity: quantityMatch ? Number(quantityMatch[1]) : null,
    unit: quantityMatch ? normalizeUnit(quantityMatch[2]) : 'kg',
    rawText: text,
  };
}

function normalizeUnit(value) {
  const lower = String(value).toLowerCase();
  if (lower.startsWith('portion')) return 'portions';
  if (lower.startsWith('box')) return 'boxes';
  if (lower.startsWith('piece')) return 'pieces';
  return 'kg';
}

export async function parseDonationText(message) {
  if (!env.openaiApiKey) return { source: 'regex', fields: regexParse(message) };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.openaiModel,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Extract food donation fields. Return JSON only: foodName, foodType, quantity, unit, readyAt, safeUntil, dietaryType, storageState, location, notes. Do not invent values. Use null when absent.' },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!response.ok) return { source: 'regex-fallback', fields: regexParse(message) };

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return { source: 'regex-fallback', fields: regexParse(message) };

  try {
    return { source: 'openai', fields: JSON.parse(content) };
  } catch {
    return { source: 'regex-fallback', fields: regexParse(message) };
  }
}
