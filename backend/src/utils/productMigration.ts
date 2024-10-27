import { DataSource } from "typeorm";
import { CentralProduct } from "../entities/ProductEntity";
import { CentralCategory } from "../entities/CategoryEntity";
import { CentralOperation } from "../entities/OperationEntity";
import { config } from "dotenv";
import { CentralOrder } from "../entities/OrderEntity";
import { CentralCustomer } from "../entities/CustomerEntity";

// Load environment variables
config();

// Define the SQLite Product structure
interface SQLiteProduct {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  type: string;
}

// Database configurations
const sourceConfig = {
  type: "sqlite" as const,
  database: "/home/ayman/sqlite.db",
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
  // Include all related entities
  entities: [CentralProduct, CentralCategory, CentralOperation, CentralOrder, CentralCustomer],
  synchronize: false,
};

async function validateConnection() {
  console.log("Validating PostgreSQL connection configuration:");
  console.log("Host:", targetConfig.host);
  console.log("Port:", targetConfig.port);
  console.log("Database:", targetConfig.database);
  console.log("Username:", targetConfig.username);

  if (!targetConfig.password) {
    throw new Error("Database password is not set in environment variables");
  }
}

async function migrateProductsAndCategories() {
  await validateConnection();

  const sourceDs = new DataSource(sourceConfig);
  const targetDs = new DataSource(targetConfig);

  try {
    console.log("Initializing database connections...");
    await sourceDs.initialize();
    console.log("SQLite connection initialized successfully");

    await targetDs.initialize();
    console.log("PostgreSQL connection initialized successfully");

    // 1. Get all unique product types from SQLite
    const sqliteProducts: SQLiteProduct[] = await sourceDs.query("SELECT * FROM Products");

    // Extract unique types for categories
    const uniqueTypes = [...new Set(sqliteProducts.map((product) => product.type))];
    console.log(`Found ${uniqueTypes.length} unique categories to migrate`);

    // 2. Create categories in PostgreSQL
    const categoryRepo = targetDs.getRepository(CentralCategory);
    const categoryMap = new Map<string, CentralCategory>();

    for (const type of uniqueTypes) {
      if (!type) continue;

      try {
        let category = await categoryRepo.findOne({ where: { name: type } });

        if (!category) {
          category = categoryRepo.create({ name: type });
          category = await categoryRepo.save(category);
          console.log(`Created category: ${type}`);
        } else {
          console.log(`Using existing category: ${type}`);
        }

        categoryMap.set(type, category);
      } catch (error) {
        console.error(`Failed to process category ${type}:`, error);
        throw error;
      }
    }

    // 3. Migrate products with their categories
    const productRepo = targetDs.getRepository(CentralProduct);
    const batchSize = 1000;

    console.log(`Starting product migration in batches of ${batchSize}`);

    for (let i = 0; i < sqliteProducts.length; i += batchSize) {
      const batch = sqliteProducts.slice(i, i + batchSize);
      const productsToSave = batch.map((sqliteProduct) => {
        const category = categoryMap.get(sqliteProduct.type);

        return productRepo.create({
          name: sqliteProduct.name,
          measure: "pieces",
          price: sqliteProduct.price,
          category: category,
          operations: [], // Initialize empty operations array
        });
      });

      await productRepo.save(productsToSave);
      console.log(`Migrated products ${i + 1} to ${i + batch.length} of ${sqliteProducts.length}`);
    }

    console.log("Migration completed successfully");
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
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { migrateProductsAndCategories };
