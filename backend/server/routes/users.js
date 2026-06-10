import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, isStaff } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  formatAdminUser,
  formatAuthUser,
  parseRole,
  parseUserStatus,
} from '../utils/formatters.js';
import { hashPassword } from '../utils/password.js';

const router = Router();

router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(formatAuthUser(user));
  })
);

router.get(
  '/',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(users.map(formatAdminUser));
  })
);

router.put(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const isSelf = req.user.id === req.params.id;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(req.user.role);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const data = {};
    const { name, email, phone, role, status, password } = req.body;

    if (name) data.name = name.trim();
    if (email) data.email = email.trim().toLowerCase();
    if (phone !== undefined) data.phone = phone || null;
    if (password) data.passwordHash = hashPassword(password);

    if (isAdmin) {
      if (role) data.role = parseRole(role);
      if (status) data.status = parseUserStatus(status);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });

    res.json(isAdmin ? formatAdminUser(user) : formatAuthUser(user));
  })
);

router.delete(
  '/:id',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  })
);

export default router;
