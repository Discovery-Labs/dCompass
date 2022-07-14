import { PrismaClient } from "@prisma/client";

import * as dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("SEEDING...");
  const allTags = [
    { value: "dao", label: "DAO", color: "blue" },
    { value: "blockchain", label: "Blockchain", color: "yellow" },
    { label: "Tooling", value: "tooling", color: "teal" },
    { label: "Wallets", value: "wallets", color: "orange" },
    { label: "Scaling solutions", value: "scaling-solutions", color: "red" },
    { label: "Storage", value: "storage", color: "cyan" },
    { label: "NFT", value: "nft", color: "purple" },
    { label: "DeFi", value: "defi", color: "green" },
    { label: "Security", value: "security", color: "gray" },
    { label: "DEX", value: "dex", color: "green" },
    { label: "Oracles", value: "oracles", color: "blue" },
    { label: "Play to earn", value: "play-to-earn", color: "purple" },
    { label: "Learn to earn", value: "learn-to-earn", color: "yellow" },
    { label: "Build to earn", value: "build-to-earn", color: "orange" },
  ];
  const createdTags = await prisma.tag.createMany({
    skipDuplicates: true,
    data: allTags,
  });
  console.log("SEEDING DONE", createdTags);
  return createdTags;
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
