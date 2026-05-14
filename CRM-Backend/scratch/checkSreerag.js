import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = "8590ab86-082f-4b1d-9e46-3b3d7fdaf5b2"; // Sreerag Pk
  const userName = "Sreerag Pk";

  console.log(`Checking deals for User: ${userName} (${userId})`);

  const deals = await prisma.deal.findMany({
    where: {
      OR: [
        { dealOwnerId: userId },
        { personInCharge: { equals: userName, mode: "insensitive" } },
        { assignments: { some: { userId: userId } } },
        {
          account: {
            OR: [
              { accountOwnerId: userId },
              { keyAccountManagerId: userId },
              { assignments: { some: { userId: userId } } },
            ],
          },
        },
      ],
    },
    include: {
        account: true,
        owner: true,
    }
  });

  console.log(`Found ${deals.length} deals:`);
  deals.forEach(d => {
    console.log(`- ${d.dealName} | Account: ${d.account?.accountName} | Owner: ${d.owner?.name}`);
  });

  const accountsAsKam = await prisma.account.findMany({
    where: { keyAccountManagerId: userId }
  });
  console.log(`\nAccounts where KAM: ${accountsAsKam.length}`);
  accountsAsKam.forEach(a => console.log(`- ${a.accountName} (${a.id})`));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
