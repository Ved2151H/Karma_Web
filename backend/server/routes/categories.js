import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate, isStaff } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatCategory, parseCategoryStatus, slugify } from '../utils/formatters.js';

const router = Router();

async function getCategoryWithCount(categoryId) {
  const [category, count] = await Promise.all([
    prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        subcategories: {
          include: {
            subsections: { orderBy: { name: 'asc' } },
          },
          orderBy: { name: 'asc' },
        },
      },
    }),
    prisma.product.count({ where: { categoryId } }),
  ]);

  return formatCategory(category, count);
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            subsections: { orderBy: { name: 'asc' } },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const counts = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: { _all: true },
    });

    const countMap = Object.fromEntries(counts.map((entry) => [entry.categoryId, entry._count._all]));

    res.json(categories.map((category) => formatCategory(category, countMap[category.id] || 0)));
  })
);

router.post(
  '/',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const { name, slug, status, subcategories } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const subcategoriesData = Array.isArray(subcategories)
      ? subcategories
          .map((sub) => {
            const subName = typeof sub === 'string' ? sub.trim() : sub.name?.trim();
            if (!subName) return null;

            const subsectionsData = Array.isArray(sub.subsections)
              ? sub.subsections
                  .map((ss) => {
                    const ssName = typeof ss === 'string' ? ss.trim() : ss.name?.trim();
                    return ssName ? { name: ssName, slug: slugify(ssName) } : null;
                  })
                  .filter(Boolean)
              : [];

            return {
              name: subName,
              slug: slugify(subName),
              ...(subsectionsData.length > 0 ? { subsections: { create: subsectionsData } } : {}),
            };
          })
          .filter(Boolean)
      : [];

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug ? slugify(slug) : slugify(name),
        status: parseCategoryStatus(status) || 'ACTIVE',
        ...(subcategoriesData.length > 0 ? { subcategories: { create: subcategoriesData } } : {}),
      },
      include: {
        subcategories: {
          include: { subsections: true },
        },
      },
    });

    res.status(201).json(formatCategory(category, 0));
  })
);

router.put(
  '/:id',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const { name, slug, status, subcategories } = req.body;

    await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(slug ? { slug: slugify(slug) } : {}),
        ...(status ? { status: parseCategoryStatus(status) } : {}),
      },
    });

    if (Array.isArray(subcategories)) {
      const existingSubs = await prisma.subcategory.findMany({
        where: { categoryId: req.params.id },
      });

      const inputIds = subcategories.filter((s) => s.id).map((s) => s.id);

      // Delete subcategories not in the input and having no products
      for (const sub of existingSubs) {
        if (!inputIds.includes(sub.id)) {
          const prodCount = await prisma.product.count({ where: { subcategoryId: sub.id } });
          if (prodCount === 0) {
            await prisma.subcategory.delete({ where: { id: sub.id } });
          }
        }
      }

      // Create or Update subcategories
      for (const sub of subcategories) {
        const subName = typeof sub === 'string' ? sub.trim() : sub.name?.trim();
        if (!subName) continue;

        let dbSub;
        if (sub.id) {
          dbSub = await prisma.subcategory.update({
            where: { id: sub.id },
            data: { name: subName, slug: slugify(subName) },
          });
        } else {
          dbSub = await prisma.subcategory.create({
            data: {
              name: subName,
              slug: slugify(subName),
              categoryId: req.params.id,
            },
          });
        }

        // Handle nested subsections if provided
        if (sub.subsections !== undefined) {
          const subsectionsInput = Array.isArray(sub.subsections) ? sub.subsections : [];
          const existingSubsecs = await prisma.subsection.findMany({
            where: { subcategoryId: dbSub.id },
          });

          const inputSubsecIds = subsectionsInput.filter((ss) => ss.id).map((ss) => ss.id);

          // Delete subsections not in the input and having no products
          for (const subsec of existingSubsecs) {
            if (!inputSubsecIds.includes(subsec.id)) {
              const prodCount = await prisma.product.count({ where: { subsectionId: subsec.id } });
              if (prodCount === 0) {
                await prisma.subsection.delete({ where: { id: subsec.id } });
              }
            }
          }

          // Create or Update subsections
          for (const ss of subsectionsInput) {
            const ssName = typeof ss === 'string' ? ss.trim() : ss.name?.trim();
            if (!ssName) continue;

            if (ss.id) {
              await prisma.subsection.update({
                where: { id: ss.id },
                data: { name: ssName, slug: slugify(ssName) },
              });
            } else {
              await prisma.subsection.create({
                data: {
                  name: ssName,
                  slug: slugify(ssName),
                  subcategoryId: dbSub.id,
                },
              });
            }
          }
        }
      }
    }

    res.json(await getCategoryWithCount(req.params.id));
  })
);

router.delete(
  '/:id',
  authenticate,
  isStaff,
  asyncHandler(async (req, res) => {
    const productCount = await prisma.product.count({ where: { categoryId: req.params.id } });
    if (productCount > 0) {
      return res.status(400).json({ message: 'Cannot delete a category that still has products' });
    }

    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  })
);

export default router;
