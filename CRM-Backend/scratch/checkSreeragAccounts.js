import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = "8590ab86-082f-4b1d-9e46-3b3d7fdaf5b2"; // Sreerag Pk

  const accounts = await prisma.account.findMany({
    where: {
      OR: [
        { keyAccountManagerId: userId },
        { accountOwnerId: userId },
        { assignments: { some: { userId: userId } } },
      ]
    },
    include: { keyAccountManager: true }
  });

  console.log(`Found ${accounts.length} accounts for Sreerag:`);
  accounts.forEach(a => {
    console.log(`- ${a.accountName} (KAM ID: ${a.keyAccountManagerId}, KAM Name: ${a.keyAccountManager?.name})`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
