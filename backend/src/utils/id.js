import crypto from 'node:crypto';

export function createPublicId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}
