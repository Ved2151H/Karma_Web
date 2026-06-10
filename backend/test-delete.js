import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Finding a category and subcategory...');
  const category = await prisma.category.findFirst({
    include: { subcategories: true },
  });

  if (!category || !category.subcategories[0]) {
    console.error('No categories/subcategories found in DB. Run seed first.');
    process.exit(1);
  }

  const subcategory = category.subcategories[0];

  console.log('Creating a test user...');
  const user = await prisma.user.create({
    data: {
      name: 'Test Cascade User',
      email: `cascade-${Date.now()}@test.com`,
      passwordHash: 'dummy',
    },
  });

  console.log('Creating a test product...');
  const product = await prisma.product.create({
    data: {
      title: 'Delete Cascade Test Product',
      image: 'https://images.unsplash.com/photo-1590786275628-309e52d713be?q=80&w=600',
      price: 150.0,
      stock: 5,
      categoryId: category.id,
      subcategoryId: subcategory.id,
    },
  });

  console.log('Creating cart and wishlist items for product...');
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: {
          productId: product.id,
          quantity: 2,
        },
      },
    },
  });

  const wish = await prisma.wishlistItem.create({
    data: {
      userId: user.id,
      productId: product.id,
    },
  });

  console.log('Attempting to delete the product (expecting cascade delete of cart/wishlist items)...');
  try {
    const deleted = await prisma.product.delete({
      where: { id: product.id },
    });
    console.log('Product deleted successfully:', deleted.title);

    // Verify relations are gone
    const cartItems = await prisma.cartItem.findMany({ where: { productId: product.id } });
    const wishItems = await prisma.wishlistItem.findMany({ where: { productId: product.id } });
    console.log(`Remaining CartItems: ${cartItems.length}, WishlistItems: ${wishItems.length}`);
  } catch (error) {
    console.error('Failed to delete product:', error);
  } finally {
    // Cleanup user
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
  }
}

run()
  .catch((err) => console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
