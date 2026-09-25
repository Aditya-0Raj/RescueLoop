import crypto from 'node:crypto';

export function generateOtp() {
  return String(crypto.randomInt(1000, 10000));
}
