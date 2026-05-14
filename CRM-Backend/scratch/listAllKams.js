import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.account.findMany({
    include: { keyAccountManager: true }
  });

  console.log("Listing all accounts and their KAMs:");
  accounts.forEach(a => {
    console.log(`- ${a.accountName} | KAM: ${a.keyAccountManager?.name || "NONE"}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
