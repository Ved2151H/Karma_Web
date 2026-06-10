import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatProduct } from '../utils/formatters.js';

const router = Router();

router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: { include: { category: true, subcategory: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      ids: items.map((item) => item.productId),
      items: items.map((item) => formatProduct(item.product)),
    });
  })
);

router.post(
  '/:productId',
  authenticate,
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: req.params.productId,
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        productId: req.params.productId,
      },
    });

    res.status(201).json({ success: true, productId: req.params.productId });
  })
);

router.delete(
  '/:productId',
  authenticate,
  asyncHandler(async (req, res) => {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: req.user.id,
        productId: req.params.productId,
      },
    });

    res.json({ success: true });
  })
);

export default router;
