import { verifyAccessToken } from '../utils/jwt.js';
import { asyncHandler } from './errorHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = header.slice(7);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

export const isAdmin = authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER');
export const isStaff = authorize('SUPER_ADMIN', 'ADMIN');
export const isSuperAdmin = authorize('SUPER_ADMIN', 'ADMIN');
