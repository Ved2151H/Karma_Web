import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addPhase2Columns() {
  console.log('Adding images and reviews columns to products table...');
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
        ADD COLUMN IF NOT EXISTS "images"  JSONB,
        ADD COLUMN IF NOT EXISTS "reviews" JSONB;
    `);
    console.log('✅ Columns added successfully.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

addPhase2Columns();
