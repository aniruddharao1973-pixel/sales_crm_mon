import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Updating UserRole enum in PostgreSQL...");

  // We need to add the new values to the enum type in PostgreSQL directly
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN'`);
    await prisma.$executeRawUnsafe(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'TSL'`);
    await prisma.$executeRawUnsafe(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'KAM'`);
    await prisma.$executeRawUnsafe(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'TSE'`);
    console.log("New values added to enum.");
  } catch (e) {
    console.log("Enum values might already exist or error occurred:", e.message);
  }

  console.log("Migrating user roles...");
  await prisma.$executeRaw`UPDATE "User" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN'`;
  await prisma.$executeRaw`UPDATE "User" SET "role" = 'TSE' WHERE "role" = 'SALES_REP'`;

  console.log("Migration complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
