import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const deal = await prisma.deal.findFirst({
    where: { dealName: "FCT for YFG OEM" },
    include: {
      account: true,
      assignments: true,
    }
  });
  console.log(JSON.stringify(deal, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
