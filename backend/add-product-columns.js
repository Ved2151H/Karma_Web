import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addProductColumns() {
  console.log('Adding attributes, highlights, specs columns to products table...');
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
        ADD COLUMN IF NOT EXISTS "attributes" JSONB,
        ADD COLUMN IF NOT EXISTS "highlights" JSONB,
        ADD COLUMN IF NOT EXISTS "specs"      JSONB;
    `);
    console.log('✅ Columns added (or already exist).');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

addProductColumns();
