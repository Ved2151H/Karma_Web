import prisma from '../lib/prisma.js';

try {
  const [categories, subcategories, users, settings] = await Promise.all([
    prisma.category.findMany({ include: { subcategories: true }, orderBy: { slug: 'asc' } }),
    prisma.subcategory.count(),
    prisma.user.findMany({ select: { email: true, role: true, name: true } }),
    prisma.storeSettings.findUnique({ where: { id: 'default' } }),
  ]);

  console.log('Categories:', categories.length);
  categories.forEach((category) => {
    console.log(`  ${category.slug} (${category.subcategories.length} subcategories)`);
  });
  console.log('Subcategories total:', subcategories);
  console.log('Users:', users.length);
  users.forEach((user) => console.log(`  ${user.email} [${user.role}]`));
  console.log('Store settings:', settings?.storeName ?? 'missing');
} catch (error) {
  console.error('Verify failed:', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
