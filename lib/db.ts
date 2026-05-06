import { PrismaClient } from "@/app/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function makeUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const abs = path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/");
  return `file:${abs}`;
}

function createPrismaClient() {
  const adapter = new PrismaLibSql({ url: makeUrl() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
