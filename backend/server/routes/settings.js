import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, isStaff } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    res.json(settings);
  })
);

router.put(
  '/',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const { storeName, email, phone, address } = req.body;

    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(storeName ? { storeName } : {}),
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        ...(address ? { address } : {}),
      },
      create: {
        id: 'default',
        storeName: storeName || 'KARAM Safety Online Store',
        email: email || 'support@karam.in',
        phone: phone || '+91 120 4734400',
        address: address || 'D-95, Sector 63, Noida, Uttar Pradesh 201301, India',
      },
    });

    res.json(settings);
  })
);

export default router;
