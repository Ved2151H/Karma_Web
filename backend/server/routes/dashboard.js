import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, isStaff } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get(
  '/stats',
  authenticate,
  isStaff,
  asyncHandler(async (_req, res) => {
    const [products, categories, orders, users] = await Promise.all([
      prisma.product.count(),
      prisma.category.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    res.json({ products, categories, orders, users });
  })
);

export default router;
