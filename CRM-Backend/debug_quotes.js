// debug_quotes.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const target = 'FY2627.1022_R3';
  const q = await prisma.quotation.findFirst({ where: { quotationNo: target } });
  if (!q) {
    console.log("Not found:", target);
    return;
  }
  console.log("Found target:", q.quotationNo, "DealID:", q.dealId);
  const all = await prisma.quotation.findMany({ where: { dealId: q.dealId } });
  console.log("All quotes for this DealID:");
  all.forEach(x => console.log(`- ${x.quotationNo} (ID: ${x.id}, isLatest: ${x.isLatest}, version: ${x.version})`));
}

main().finally(() => prisma.$disconnect());
