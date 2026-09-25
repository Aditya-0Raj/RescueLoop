import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export async function authOptional(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const token = header.slice(7);
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.sub);
      if (user) req.user = user;
    }

    if (!req.user && env.demoMode) {
      const demoRole = req.headers['x-demo-role'];
      const demoEmail = req.headers['x-demo-email'] || (demoRole ? `${demoRole}@rescueloop.local` : null);
      if (demoEmail) req.user = await User.findOne({ email: demoEmail.toLowerCase() });
    }

    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired authentication token'));
  }
}

export function requireAuth(req, _res, next) {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  return next();
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, `Role must be one of: ${roles.join(', ')}`));
    return next();
  };
}

export function signUser(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: '7d' });
}
