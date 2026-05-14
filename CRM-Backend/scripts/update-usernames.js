import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating existing demo users with usernames...');

  // 1. Admin
  await prisma.user.updateMany({
    where: { email: 'admin@crm.com' },
    data: { username: 'admin_user' },
  });

  // 2. Manager
  await prisma.user.updateMany({
    where: { email: 'sarah@crm.com' },
    data: { username: 'manager_user' },
  });

  // 3. Sales Rep
  await prisma.user.updateMany({
    where: { email: 'john@crm.com' },
    data: { username: 'sales_user' },
  });

  console.log('Successfully updated users with usernames.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
