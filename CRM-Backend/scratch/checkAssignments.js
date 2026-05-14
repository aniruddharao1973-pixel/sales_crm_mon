import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = "8590ab86-082f-4b1d-9e46-3b3d7fdaf5b2"; // Sreerag Pk

  const accountAssignments = await prisma.accountAssignment.findMany({
    where: { userId },
    include: { account: true }
  });

  console.log(`Sreerag is assigned to ${accountAssignments.length} accounts:`);
  accountAssignments.forEach(aa => {
    console.log(`- ${aa.account.accountName} (${aa.accountId})`);
  });

  const dealAssignments = await prisma.dealAssignment.findMany({
    where: { userId },
    include: { deal: true }
  });
  console.log(`\nSreerag is assigned to ${dealAssignments.length} deals:`);
  dealAssignments.forEach(da => {
    console.log(`- ${da.deal.dealName} (${da.dealId})`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
