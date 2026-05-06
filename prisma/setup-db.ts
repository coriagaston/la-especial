import "dotenv/config";
import { createClient } from "@libsql/client";
import { resolve } from "path";

const url = process.env.DATABASE_URL
  ?? `file:${resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const authToken = process.env.DATABASE_AUTH_TOKEN;

const db = createClient({ url, ...(authToken && { authToken }) });

async function main() {
  console.log("🔧 Creating tables in:", url);

  const statements = [
    `CREATE TABLE IF NOT EXISTS "Category" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "emoji" TEXT NOT NULL DEFAULT '🍝',
      "unit" TEXT NOT NULL DEFAULT '',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT "Category_slug_key" UNIQUE ("slug")
    )`,
    `CREATE TABLE IF NOT EXISTS "Product" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "categoryId" INTEGER NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "price" REAL NOT NULL,
      "available" INTEGER NOT NULL DEFAULT 1,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "imageUrl" TEXT,
      CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "DailySpecial" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "date" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "price" REAL NOT NULL,
      "available" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "AdminUser" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      CONSTRAINT "AdminUser_email_key" UNIQUE ("email")
    )`,
  ];

  for (const sql of statements) {
    await db.execute(sql);
  }

  console.log("✅ Tables created successfully");
  db.close();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
