// test_api_logic.js
import prisma from "./src/utils/prisma.js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const quotationNo = 'FY2627.1022_R3';
  console.log("🔍 Testing logic for:", quotationNo);

  const current = await prisma.quotation.findFirst({
    where: { quotationNo },
    select: { dealId: true },
  });

  console.log("🔍 Found current quote dealId:", current?.dealId);

  if (current) {
    const data = await prisma.quotation.findMany({
      where: { dealId: current.dealId },
      orderBy: { version: "desc" },
    });
    console.log("🔍 History results count:", data.length);
    data.forEach(q => console.log(`- ${q.quotationNo} (v${q.version})`));
  }
}

main().finally(() => prisma.$disconnect());
