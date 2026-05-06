import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { resolve } from "path";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL
  ?? `file:${resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

function today(): string {
  return new Date().toISOString().split("T")[0];
}

async function main() {
  console.log("🌱 Seeding La Especial database...");

  // ─── Admin User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@laespecial.com" },
    update: {},
    create: {
      email: "admin@laespecial.com",
      password: hashedPassword,
      name: "Admin La Especial",
    },
  });
  console.log("✓ Admin user created");

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = [
    {
      name: "Sorrentinos",
      slug: "sorrentinos",
      emoji: "🫓",
      unit: "x12 unidades · rinde 2 porciones",
      sortOrder: 1,
    },
    {
      name: "Ravioles",
      slug: "ravioles",
      emoji: "🍝",
      unit: "x2 planchas · rinde 3 porciones",
      sortOrder: 2,
    },
    {
      name: "Fideos",
      slug: "fideos",
      emoji: "🍜",
      unit: "x500gr · rinde 3-4 porciones",
      sortOrder: 3,
    },
    {
      name: "Ñoquis",
      slug: "noquis",
      emoji: "⚪",
      unit: "x500gr · rinde 2 porciones",
      sortOrder: 4,
    },
    {
      name: "Canelones",
      slug: "canelones",
      emoji: "🌯",
      unit: "x4 unidades · rinde 2 porciones",
      sortOrder: 5,
    },
    {
      name: "Lasagnas",
      slug: "lasagnas",
      emoji: "🫕",
      unit: "bandeja 600-700gr · rinde 2 porciones · congeladas",
      sortOrder: 6,
    },
    {
      name: "Pizzas",
      slug: "pizzas",
      emoji: "🍕",
      unit: "8 porciones al molde · congeladas",
      sortOrder: 7,
    },
    {
      name: "Productos Congelados",
      slug: "productos-congelados",
      emoji: "❄️",
      unit: "Chipas, pascualinas, tartines y empanadas",
      sortOrder: 8,
    },
    {
      name: "Salsas",
      slug: "salsas",
      emoji: "🥫",
      unit: "x3 porciones · listas para servir",
      sortOrder: 9,
    },
  ];

  const createdCategories: Record<string, number> = {};

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        emoji: cat.emoji,
        unit: cat.unit,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log("✓ Categories created");

  // ─── Products ──────────────────────────────────────────────────────────────
  const products: {
    categorySlug: string;
    name: string;
    description?: string;
    price: number;
    sortOrder: number;
  }[] = [
    // SORRENTINOS
    {
      categorySlug: "sorrentinos",
      name: "Espinaca / Ricota / Queso",
      price: 2500,
      sortOrder: 1,
    },
    {
      categorySlug: "sorrentinos",
      name: "Calabaza / Queso",
      price: 2500,
      sortOrder: 2,
    },
    {
      categorySlug: "sorrentinos",
      name: "Ricota / Jamón / Nuez",
      price: 2500,
      sortOrder: 3,
    },
    {
      categorySlug: "sorrentinos",
      name: "Jamón / Queso",
      price: 2500,
      sortOrder: 4,
    },
    {
      categorySlug: "sorrentinos",
      name: "4 Quesos / Ricota",
      price: 2500,
      sortOrder: 5,
    },
    {
      categorySlug: "sorrentinos",
      name: "Batata Caramelizada / Queso Gouda",
      price: 2500,
      sortOrder: 6,
    },

    // RAVIOLES
    {
      categorySlug: "ravioles",
      name: "Verdura",
      price: 2200,
      sortOrder: 1,
    },
    {
      categorySlug: "ravioles",
      name: "Ricota",
      price: 2200,
      sortOrder: 2,
    },
    {
      categorySlug: "ravioles",
      name: "Pollo y Verdura",
      price: 2200,
      sortOrder: 3,
    },
    {
      categorySlug: "ravioles",
      name: "Raviolones de Vacío y Provoleta",
      price: 2200,
      sortOrder: 4,
    },

    // FIDEOS
    {
      categorySlug: "fideos",
      name: "Al Huevo",
      price: 1800,
      sortOrder: 1,
    },
    {
      categorySlug: "fideos",
      name: "Espinaca",
      price: 1800,
      sortOrder: 2,
    },
    {
      categorySlug: "fideos",
      name: "Morrón",
      price: 1800,
      sortOrder: 3,
    },
    {
      categorySlug: "fideos",
      name: "Integrales",
      price: 1800,
      sortOrder: 4,
    },

    // ÑOQUIS
    {
      categorySlug: "noquis",
      name: "Papa",
      price: 1600,
      sortOrder: 1,
    },
    {
      categorySlug: "noquis",
      name: "Espinaca",
      price: 1600,
      sortOrder: 2,
    },

    // CANELONES
    {
      categorySlug: "canelones",
      name: "Carne y Verdura",
      price: 2800,
      sortOrder: 1,
    },
    {
      categorySlug: "canelones",
      name: "Espinaca / Ricota / Muzzarella",
      price: 2800,
      sortOrder: 2,
    },

    // LASAGNAS
    {
      categorySlug: "lasagnas",
      name: "Bondiola Braseada",
      price: 3500,
      sortOrder: 1,
    },
    {
      categorySlug: "lasagnas",
      name: "Carne",
      price: 3500,
      sortOrder: 2,
    },
    {
      categorySlug: "lasagnas",
      name: "Espinaca y Ricota",
      price: 3500,
      sortOrder: 3,
    },
    {
      categorySlug: "lasagnas",
      name: "La Especial",
      description: "Nuestra lasagna signature con ingredientes seleccionados",
      price: 3500,
      sortOrder: 4,
    },

    // PIZZAS
    {
      categorySlug: "pizzas",
      name: "Muzzarella",
      price: 3200,
      sortOrder: 1,
    },
    {
      categorySlug: "pizzas",
      name: "Fugazzeta",
      price: 3200,
      sortOrder: 2,
    },
    {
      categorySlug: "pizzas",
      name: "Jamón y Morrones",
      price: 3200,
      sortOrder: 3,
    },
    {
      categorySlug: "pizzas",
      name: "Roquefort",
      price: 3200,
      sortOrder: 4,
    },
    {
      categorySlug: "pizzas",
      name: "4 Quesos",
      price: 3200,
      sortOrder: 5,
    },
    {
      categorySlug: "pizzas",
      name: "Pepperoni",
      price: 3200,
      sortOrder: 6,
    },

    // PRODUCTOS CONGELADOS
    {
      categorySlug: "productos-congelados",
      name: "Chipa 400gr",
      price: 800,
      sortOrder: 1,
    },
    {
      categorySlug: "productos-congelados",
      name: "Chipa 1kg",
      price: 1800,
      sortOrder: 2,
    },
    {
      categorySlug: "productos-congelados",
      name: "Pascualina de Verdura",
      price: 2800,
      sortOrder: 3,
    },
    {
      categorySlug: "productos-congelados",
      name: "Tartine Calabaza / Nuez / Muzzarella",
      price: 1200,
      sortOrder: 4,
    },
    {
      categorySlug: "productos-congelados",
      name: "Tartine Verdura / Muzzarella",
      price: 1200,
      sortOrder: 5,
    },
    {
      categorySlug: "productos-congelados",
      name: "Tartine Jamón / Muzzarella",
      price: 1200,
      sortOrder: 6,
    },
    {
      categorySlug: "productos-congelados",
      name: "Tartine Roquefort / Nuez",
      price: 1200,
      sortOrder: 7,
    },
    {
      categorySlug: "productos-congelados",
      name: "Empanadas de Carne x6",
      price: 1800,
      sortOrder: 8,
    },
    {
      categorySlug: "productos-congelados",
      name: "Empanadas de Jamón y Queso x6",
      price: 1800,
      sortOrder: 9,
    },
    {
      categorySlug: "productos-congelados",
      name: "Empanadas de Espinaca y Salsa Blanca x6",
      price: 1800,
      sortOrder: 10,
    },
    {
      categorySlug: "productos-congelados",
      name: "Empanadas de Cebolla y Queso x6",
      price: 1800,
      sortOrder: 11,
    },

    // SALSAS
    {
      categorySlug: "salsas",
      name: "Bolognesa",
      price: 1200,
      sortOrder: 1,
    },
    {
      categorySlug: "salsas",
      name: "Pomodoro",
      price: 1200,
      sortOrder: 2,
    },
    {
      categorySlug: "salsas",
      name: "Panceta y Verdeo",
      price: 1200,
      sortOrder: 3,
    },
    {
      categorySlug: "salsas",
      name: "Crema",
      price: 1200,
      sortOrder: 4,
    },
    {
      categorySlug: "salsas",
      name: "Roquefort",
      price: 1200,
      sortOrder: 5,
    },
    {
      categorySlug: "salsas",
      name: "Crema de Puerros",
      price: 1200,
      sortOrder: 6,
    },
    {
      categorySlug: "salsas",
      name: "Queso Rallado",
      price: 900,
      sortOrder: 7,
    },
  ];

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const categoryId = createdCategories[categorySlug];

    // Check if product already exists in this category
    const existing = await prisma.product.findFirst({
      where: { categoryId, name: productData.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          ...productData,
          categoryId,
          available: true,
        },
      });
    }
  }
  console.log(`✓ ${products.length} products seeded`);

  // ─── Daily Specials (today) ─────────────────────────────────────────────────
  const todayStr = today();

  const existingSpecials = await prisma.dailySpecial.findMany({
    where: { date: todayStr },
  });

  if (existingSpecials.length === 0) {
    await prisma.dailySpecial.createMany({
      data: [
        {
          date: todayStr,
          name: "Sorrentinos de Espinaca con Salsa Bolognesa",
          description:
            "12 sorrentinos de espinaca/ricota/queso con salsa bolognesa casera. Rinde 2 porciones.",
          price: 3700,
          available: true,
        },
        {
          date: todayStr,
          name: "Lasagna de Bondiola Braseada",
          description:
            "Bandeja individual de lasagna con bondiola braseada y salsa bechamel. Lista para calentar.",
          price: 3500,
          available: true,
        },
        {
          date: todayStr,
          name: "Ravioles de Ricota con Crema de Puerros",
          description:
            "2 planchas de ravioles de ricota con salsa crema de puerros incluida. Rinde 3 porciones.",
          price: 3400,
          available: true,
        },
      ],
    });
    console.log("✓ Daily specials seeded");
  } else {
    console.log("✓ Daily specials already exist, skipping");
  }

  console.log("\n✅ Seeding complete!");
  console.log("📧 Admin: admin@laespecial.com");
  console.log("🔑 Password: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
