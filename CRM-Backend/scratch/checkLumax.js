import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const account = await prisma.account.findFirst({
    where: { accountName: { contains: "Lumax", mode: "insensitive" } },
    include: {
      keyAccountManager: true,
      deals: {
        include: {
            owner: true,
            assignments: { include: { user: true } }
        }
      }
    }
  });

  if (account) {
    console.log("Account Name:", account.accountName);
    console.log("KAM:", account.keyAccountManager?.name, `(${account.keyAccountManagerId})`);
    console.log(`\nDeals under this account (${account.deals.length}):`);
    account.deals.forEach(d => {
        console.log(`- ${d.dealName} | Owner: ${d.owner?.name} | Assignments: ${d.assignments.map(a => a.user.name).join(", ")}`);
    });
  } else {
    console.log("Lumax account not found");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
