import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, isStaff } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatProduct } from '../utils/formatters.js';

const router = Router();

const productInclude = {
  category: true,
  subcategory: true,
  subsection: true,
};

async function resolveCategorySubcategoryAndSubsection(categorySlug, subcategorySlug, subsectionSlug) {
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    const error = new Error(`Category "${categorySlug}" not found`);
    error.status = 400;
    throw error;
  }

  const subcategory = await prisma.subcategory.findFirst({
    where: { slug: subcategorySlug, categoryId: category.id },
  });

  if (!subcategory) {
    const error = new Error(`Subcategory "${subcategorySlug}" not found`);
    error.status = 400;
    throw error;
  }

  let subsection = null;
  if (subsectionSlug) {
    subsection = await prisma.subsection.findFirst({
      where: { slug: subsectionSlug, subcategoryId: subcategory.id },
    });
    if (!subsection) {
      const error = new Error(`Subsection "${subsectionSlug}" not found`);
      error.status = 400;
      throw error;
    }
  }

  return { category, subcategory, subsection };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, subcategory, subsection, brand, industry } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(subcategory ? { subcategory: { slug: subcategory } } : {}),
        ...(subsection ? { subsection: { slug: subsection } } : {}),
        ...(brand ? { brand } : {}),
        ...(industry ? { industry } : {}),
      },
      include: productInclude,
      orderBy: { dateAdded: 'desc' },
    });

    res.json(products.map(formatProduct));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(formatProduct(product));
  })
);

router.post(
  '/',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      category,
      subcategory,
      subsection,
      image,
      price,
      originalPrice,
      discount,
      badge,
      brand,
      industry,
      material,
      resistanceType,
      lensType,
      snrDnr,
      reusable,
      countryOfOrigin,
      rating,
      stock,
      dateAdded,
      attributes,
      highlights,
      specs,
      images,
    } = req.body;

    if (!title || !category || !subcategory || price == null || !image) {
      return res.status(400).json({ message: 'Title, category, subcategory, price, and image are required' });
    }

    const resolved = await resolveCategorySubcategoryAndSubsection(category, subcategory, subsection);

    const product = await prisma.product.create({
      data: {
        title,
        description,
        image,
        price,
        originalPrice,
        discount,
        badge,
        brand: brand || 'KARAM',
        industry,
        material,
        resistanceType,
        lensType,
        snrDnr,
        reusable,
        countryOfOrigin,
        rating: rating ?? 4.5,
        stock: stock ?? 0,
        dateAdded: dateAdded ? new Date(dateAdded) : new Date(),
        categoryId: resolved.category.id,
        subcategoryId: resolved.subcategory.id,
        subsectionId: resolved.subsection?.id || null,
        attributes: attributes || null,
        highlights: highlights || null,
        specs: specs || null,
        images: images || null,
        reviews: null,
      },
      include: productInclude,
    });

    res.status(201).json(formatProduct(product));
  })
);

router.put(
  '/:id',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const data = { ...req.body };
    delete data.id;

    if (data.category && data.subcategory) {
      const resolved = await resolveCategorySubcategoryAndSubsection(data.category, data.subcategory, data.subsection || null);
      data.categoryId = resolved.category.id;
      data.subcategoryId = resolved.subcategory.id;
      data.subsectionId = resolved.subsection?.id || null;
      delete data.category;
      delete data.subcategory;
      delete data.subsection;
    }

    if (data.dateAdded) {
      data.dateAdded = new Date(data.dateAdded);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: productInclude,
    });

    res.json(formatProduct(product));
  })
);

// POST /api/products/:id/reviews — append a review and recalculate rating
router.post(
  '/:id/reviews',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { author, rating, comment } = req.body;

    if (!author || !rating || !comment) {
      return res.status(400).json({ message: 'author, rating, and comment are required' });
    }
    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const product = await prisma.product.findUnique({ where: { id }, include: productInclude });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build updated reviews array
    const existingReviews = Array.isArray(product.reviews) ? product.reviews : [];
    const newReview = {
      id: Date.now(),
      author: String(author).trim(),
      rating: ratingNum,
      comment: String(comment).trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    const updatedReviews = [newReview, ...existingReviews];

    // Recalculate average rating
    const avgRating = parseFloat(
      (updatedReviews.reduce((acc, r) => acc + Number(r.rating), 0) / updatedReviews.length).toFixed(1)
    );

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        reviews: updatedReviews,
        rating: avgRating,
      },
      include: productInclude,
    });

    res.json(formatProduct(updatedProduct));
  })
);

router.delete(
  '/:id',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check product exists first
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Nullify productId in order items to preserve order history
    await prisma.$executeRaw`
      UPDATE "order_items" SET "productId" = NULL WHERE "productId" = ${id}
    `;

    // Remove from carts and wishlists
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  })
);

export default router;
