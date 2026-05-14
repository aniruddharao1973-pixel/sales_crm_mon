import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const dealId = "4c635d8d-3203-41b4-a79d-6d8190110fc4";
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      owner: true,
      account: true,
    }
  });
  
  if (deal) {
    console.log("Deal Name:", deal.dealName);
    console.log("Owner:", deal.owner?.name, `(${deal.owner?.id})`);
    console.log("Account Owner ID:", deal.account?.accountOwnerId);
    console.log("KAM ID:", deal.account?.keyAccountManagerId);
    console.log("Person in Charge:", deal.personInCharge);
  } else {
    console.log("Deal not found in DB");
  }

  // Also list all users to see who I might be
  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true }
  });
  console.log("\nUsers in DB:");
  users.forEach(u => console.log(`- ${u.name} (${u.id}) [${u.role}]`));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
