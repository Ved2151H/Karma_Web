import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatProduct } from '../utils/formatters.js';

const router = Router();

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { category: true, subcategory: true } },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: { include: { category: true, subcategory: true } },
          },
        },
      },
    });
  }

  return cart;
}

function formatCart(cart) {
  const items = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    product: formatProduct(item.product),
  }));

  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return { items, cartCount: items.reduce((sum, item) => sum + item.quantity, 0), cartTotal };
}

router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user.id);
    res.json(formatCart(cart));
  })
);

router.post(
  '/items',
  authenticate,
  asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find((item) => item.productId === productId);

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const updated = await getOrCreateCart(req.user.id);
    res.status(201).json(formatCart(updated));
  })
);

router.put(
  '/items/:productId',
  authenticate,
  asyncHandler(async (req, res) => {
    const quantity = Math.max(1, Number(req.body.quantity) || 1);
    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find((item) => item.productId === req.params.productId);

    if (!existing) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
    });

    const updated = await getOrCreateCart(req.user.id);
    res.json(formatCart(updated));
  })
);

router.delete(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user.id);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const updated = await getOrCreateCart(req.user.id);
    res.json(formatCart(updated));
  })
);

router.delete(
  '/items/:productId',
  authenticate,
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find((item) => item.productId === req.params.productId);

    if (!existing) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: existing.id } });
    const updated = await getOrCreateCart(req.user.id);
    res.json(formatCart(updated));
  })
);

export default router;
