import { DataSource } from "typeorm";
import { config } from "dotenv";

config(); // Load .env file

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Set to false in production
  entities: [__dirname + "/../entities/*"],
});
