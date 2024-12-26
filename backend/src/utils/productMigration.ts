import { DataSource } from "typeorm";
import { CentralProduct } from "../entities/ProductEntity";
import { CentralCategory } from "../entities/CategoryEntity";
import { CentralOperation } from "../entities/OperationEntity";
import { config } from "dotenv";
import { CentralOrder } from "../entities/OrderEntity";
import { CentralCustomer } from "../entities/CustomerEntity";

config();

interface SQLiteProduct {
  id?: number;
  name: string;
  quantity: number;
  price: string;
  type: string;
}

const sourceConfig = {
  type: "sqlite" as const,
  database: "/home/ayman/mydatabase.db",
  entities: [],
  synchronize: false,
};

const targetConfig = {
  type: "postgres" as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [CentralProduct, CentralCategory, CentralOperation, CentralOrder, CentralCustomer],
  synchronize: false,
};

async function migrateProductsAndCategories() {
  const sourceDs = new DataSource(sourceConfig);
  const targetDs = new DataSource(targetConfig);

  try {
    console.log("Initializing database connections...");
    await sourceDs.initialize();
    await targetDs.initialize();

    // 1. Get all products from SQLite
    const sqliteProducts: SQLiteProduct[] = await sourceDs.query("SELECT * FROM products");
    console.log(`Found ${sqliteProducts.length} products to migrate`);

    // 2. Create categories
    const categoryRepo = targetDs.getRepository(CentralCategory);
    const uniqueTypes = [...new Set(sqliteProducts.map((product) => product.type))];
    const categoryMap = new Map<string, CentralCategory>();

    for (const type of uniqueTypes) {
      if (!type) continue;
      let category = await categoryRepo.findOne({ where: { name: type } });
      if (!category) {
        category = await categoryRepo.save(categoryRepo.create({ name: type }));
        console.log(`Created category: ${type}`);
      }
      categoryMap.set(type, category);
    }

    // 3. Migrate products with duplicate handling
    const productRepo = targetDs.getRepository(CentralProduct);
    const results = {
      success: 0,
      skipped: 0,
      failed: 0,
      duplicates: [] as string[],
      errors: [] as string[],
    };

    // Process one product at a time to handle errors individually
    for (const sqliteProduct of sqliteProducts) {
      try {
        // Check if product already exists
        const existingProduct = await productRepo.findOne({
          where: { name: sqliteProduct.name },
        });

        if (existingProduct) {
          console.log(`Skipping duplicate product: ${sqliteProduct.name}`);
          results.skipped++;
          results.duplicates.push(sqliteProduct.name);
          continue;
        }

        const category = categoryMap.get(sqliteProduct.type);
        if (!category) {
          throw new Error(`Category not found for product ${sqliteProduct.name}`);
        }

        const price = parseFloat(sqliteProduct.price.replace(/[^0-9.-]+/g, ""));
        if (isNaN(price)) {
          throw new Error(`Invalid price format: ${sqliteProduct.price}`);
        }

        const product = productRepo.create({
          name: sqliteProduct.name,
          measure: "pieces",
          price: price,
          category: category,
          operations: [],
        });

        await productRepo.save(product);
        results.success++;

        if (results.success % 10 === 0) {
          console.log(`Successfully migrated ${results.success} products`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to migrate ${sqliteProduct.name}: ${error}`);
        console.error(`Error migrating product ${sqliteProduct.name}:`, error);
      }
    }

    // Print final results
    console.log("\nMigration Summary:");
    console.log(`Successfully migrated: ${results.success} products`);
    console.log(`Skipped duplicates: ${results.skipped} products`);
    console.log(`Failed: ${results.failed} products`);

    if (results.duplicates.length > 0) {
      console.log("\nDuplicate products:");
      results.duplicates.forEach((name) => console.log(`- ${name}`));
    }

    if (results.errors.length > 0) {
      console.log("\nErrors encountered:");
      results.errors.forEach((error) => console.log(`- ${error}`));
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    if (sourceDs.isInitialized) await sourceDs.destroy();
    if (targetDs.isInitialized) await targetDs.destroy();
  }
}

// CLI handler
if (require.main === module) {
  migrateProductsAndCategories()
    .then(() => {
      console.log("Migration completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { migrateProductsAndCategories };
