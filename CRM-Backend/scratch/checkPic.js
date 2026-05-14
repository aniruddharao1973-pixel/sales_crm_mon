import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const deal = await prisma.deal.findFirst({
    where: { dealName: "FCT for YFG OEM" },
    select: { personInCharge: true }
  });
  console.log("PIC of FCT for YFG OEM:", deal?.personInCharge);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
