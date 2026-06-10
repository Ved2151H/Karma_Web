import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, isStaff } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  formatAdminOrder,
  formatCustomerOrder,
  parseOrderStatus,
} from '../utils/formatters.js';

const router = Router();

function generateOrderNumber() {
  return `KRM-${Math.floor(1000 + Math.random() * 9000)}`;
}

const orderInclude = {
  items: true,
  user: { select: { id: true, name: true, email: true } },
};

router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const isAdminView = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(req.user.role);

    const orders = await prisma.order.findMany({
      where: isAdminView ? {} : { userId: req.user.id },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    if (req.query.view === 'admin' && isAdminView) {
      return res.json(orders.map(formatAdminOrder));
    }

    res.json(orders.map(formatCustomerOrder));
  })
);

router.post(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { items, total } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const productIds = items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true, subcategory: true },
    });

    const productMap = Object.fromEntries(products.map((product) => [product.id, product]));

    const orderItems = items.map((item) => {
      const product = productMap[item.id];
      if (!product) {
        const error = new Error(`Product "${item.id}" not found`);
        error.status = 400;
        throw error;
      }

      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for "${product.title}"`);
        error.status = 400;
        throw error;
      }

      return {
        productId: product.id,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const computedTotal = orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user.id,
          total: total ?? computedTotal,
          status: 'PROCESSING',
          items: { create: orderItems },
        },
        include: orderInclude,
      });
    });

    res.status(201).json(formatCustomerOrder(order));
  })
);

router.put(
  '/:id',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const status = parseOrderStatus(req.body.status);
    if (!status) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: orderInclude,
    });

    res.json(req.query.view === 'admin' ? formatAdminOrder(order) : formatCustomerOrder(order));
  })
);

router.put(
  '/:id/cancel',
  authenticate,
  asyncHandler(async (req, res) => {
    const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = existing.userId === req.user.id;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    if (['DELIVERED', 'CANCELLED'].includes(existing.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
      include: orderInclude,
    });

    res.json(formatCustomerOrder(order));
  })
);

export default router;
