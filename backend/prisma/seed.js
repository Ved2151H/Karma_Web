import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

const CATEGORY_DATA = [
  {
    slug: 'face',
    name: 'Face Protection',
    subcategories: [
      {
        slug: 'welding-face-shield',
        name: 'Welding and Face Shield',
        subsections: [
          { slug: 'welding-helmets', name: 'Welding Helmets' },
          { slug: 'face-shields', name: 'Face Shields' },
        ]
      },
      { slug: 'visors', name: 'Visors' },
      { slug: 'accessories', name: 'Accessories' },
    ],
  },
  {
    slug: 'foot',
    name: 'Foot Protection',
    subcategories: [
      {
        slug: 'safety-shoes',
        name: 'Safety Shoes',
        subsections: [
          { slug: 'steel-toe-shoes', name: 'Steel Toe Shoes' },
          { slug: 'composite-toe-shoes', name: 'Composite Toe Shoes' },
        ]
      },
      { slug: 'pvc-boots', name: 'PVC Boots' },
    ],
  },
  {
    slug: 'eye',
    name: 'Eye Protection',
    subcategories: [
      { slug: 'safety-goggles-spectacles', name: 'Safety Goggles and Spectacles' },
      { slug: 'eye-accessories', name: 'Eye Accessories' },
      { slug: 'lens-accessories', name: 'Lens Accessories' },
    ],
  },
  {
    slug: 'hand',
    name: 'Hand Protection',
    subcategories: [
      { slug: 'safety-gloves', name: 'Safety Gloves' },
      { slug: 'cut-resistant-gloves', name: 'Cut Resistant Gloves' },
      { slug: 'chemical-resistant-gloves', name: 'Chemical Resistant Gloves' },
      { slug: 'welding-gloves', name: 'Welding Gloves' },
    ],
  },
  {
    slug: 'head',
    name: 'Head Protection',
    subcategories: [
      { slug: 'industrial-helmets', name: 'Industrial Helmets' },
      { slug: 'helmet-accessories', name: 'Helmet Accessories' },
    ],
  },
  {
    slug: 'hearing',
    name: 'Hearing Protection',
    subcategories: [
      { slug: 'ear-plugs', name: 'Ear Plugs' },
      { slug: 'ear-muffs', name: 'Ear Muffs' },
    ],
  },
  {
    slug: 'fall-protection',
    name: 'Fall Protection',
    subcategories: [
      { slug: 'harnesses', name: 'Harnesses' },
      { slug: 'lanyards', name: 'Lanyards' },
      { slug: 'connectors', name: 'Connectors' },
    ],
  },
  {
    slug: 'respiratory',
    name: 'Respiratory Protection',
    subcategories: [
      { slug: 'masks', name: 'Masks' },
      { slug: 'respirators', name: 'Respirators' },
    ],
  },
  {
    slug: 'workwear',
    name: 'Workwear',
    subcategories: [
      { slug: 'coveralls', name: 'Coveralls' },
      { slug: 'rainwear', name: 'Rainwear' },
    ],
  },
  {
    slug: 'gas-detector',
    name: 'Gas Detector',
    subcategories: [
      { slug: 'single-gas-detector', name: 'Single Gas Detector' },
      { slug: 'multi-gas-detector', name: 'Multi Gas Detector' },
    ],
  },
];

const DEMO_USERS = [
  {
    name: 'KARAM Admin',
    email: 'admin@karam.in',
    phone: '9999999999',
    password: '1234',
    role: 'ADMIN',
  },
  {
    name: 'Rajesh Sharma',
    email: 'rajesh@gmail.com',
    phone: '9876543210',
    password: 'customer123',
    role: 'CUSTOMER',
  },
  {
    name: 'Priya Verma',
    email: 'priya@gmail.com',
    phone: '9876543211',
    password: 'customer123',
    role: 'CUSTOMER',
  },
];

async function seedCategories() {
  for (const category of CATEGORY_DATA) {
    const dbCat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        status: 'ACTIVE',
      },
      create: {
        name: category.name,
        slug: category.slug,
        status: 'ACTIVE',
      },
    });

    for (const sub of category.subcategories) {
      const dbSub = await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: dbCat.id,
            slug: sub.slug,
          },
        },
        update: {
          name: sub.name,
        },
        create: {
          name: sub.name,
          slug: sub.slug,
          categoryId: dbCat.id,
        },
      });

      if (sub.subsections) {
        for (const subsec of sub.subsections) {
          await prisma.subsection.upsert({
            where: {
              subcategoryId_slug: {
                subcategoryId: dbSub.id,
                slug: subsec.slug,
              },
            },
            update: {
              name: subsec.name,
            },
            create: {
              name: subsec.name,
              slug: subsec.slug,
              subcategoryId: dbSub.id,
            },
          });
        }
      }
    }
  }
}

async function seedUsers() {
  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        phone: user.phone,
        passwordHash: hashPassword(user.password),
        role: user.role,
        status: 'ACTIVE',
      },
      create: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        passwordHash: hashPassword(user.password),
        role: user.role,
        status: 'ACTIVE',
      },
    });
  }
}

const SAMPLE_PRODUCTS = [
  {
    title: 'KARAM HS61 Cut Resistant Gloves',
    categorySlug: 'hand',
    subcategorySlug: 'cut-resistant-gloves',
    price: 879,
    originalPrice: 1278,
    discount: 31,
    badge: 'Best Seller',
    brand: 'KARAM',
    industry: 'Construction',
    resistanceType: 'Cut Resistant',
    stock: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1590786275628-309e52d713be?q=80&w=600',
  },
  {
    title: 'KARAM ES52 Industrial Face Shield',
    categorySlug: 'face',
    subcategorySlug: 'welding-face-shield',
    subsectionSlug: 'face-shields',
    price: 720,
    brand: 'KARAM',
    industry: 'Manufacturing',
    material: 'Polycarbonate',
    stock: 30,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600',
  },
  {
    title: 'KARAM Safety Goggles Clear Anti-Fog',
    categorySlug: 'eye',
    subcategorySlug: 'safety-goggles-spectacles',
    price: 450,
    brand: 'KARAM',
    industry: 'Construction',
    lensType: 'Clear Anti-Fog',
    stock: 40,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb7a1d?q=80&w=600',
  },
  {
    title: 'KARAM Industrial Safety Helmet',
    categorySlug: 'head',
    subcategorySlug: 'industrial-helmets',
    price: 590,
    brand: 'KARAM',
    industry: 'Construction',
    stock: 25,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600',
  },
];

async function seedProducts() {
  for (const product of SAMPLE_PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: product.categorySlug } });
    const subcategory = await prisma.subcategory.findFirst({
      where: { slug: product.subcategorySlug, categoryId: category?.id },
    });

    if (!category || !subcategory) continue;

    let subsection = null;
    if (product.subsectionSlug) {
      subsection = await prisma.subsection.findFirst({
        where: { slug: product.subsectionSlug, subcategoryId: subcategory.id },
      });
    }

    const existing = await prisma.product.findFirst({ where: { title: product.title } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        title: product.title,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        badge: product.badge,
        brand: product.brand,
        industry: product.industry,
        material: product.material,
        resistanceType: product.resistanceType,
        lensType: product.lensType,
        stock: product.stock,
        rating: product.rating,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        subsectionId: subsection?.id || null,
      },
    });
  }
}

async function seedStoreSettings() {
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'KARAM Safety Online Store',
      email: 'support@karam.in',
      phone: '+91 120 4734400',
      address: 'D-95, Sector 63, Noida, Uttar Pradesh 201301, India',
    },
  });
}

async function main() {
  console.log('Seeding categories and subcategories...');
  await seedCategories();

  console.log('Seeding users...');
  await seedUsers();

  console.log('Seeding store settings...');
  await seedStoreSettings();

  console.log('Seeding sample products...');
  await seedProducts();

  const [categoryCount, subcategoryCount, userCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.subcategory.count(),
    prisma.user.count(),
    prisma.product.count(),
  ]);

  console.log(`Done. Categories: ${categoryCount}, Subcategories: ${subcategoryCount}, Users: ${userCount}, Products: ${productCount}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
