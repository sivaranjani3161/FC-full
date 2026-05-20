import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env explicitly for CLI usage (like migrations)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD ?? "";
if (process.env.DB_PASSWORD === undefined) {
  console.warn(
    "Warning: DB_PASSWORD is not set. Backend is falling back to empty password. Create finestcoder-backend/.env with DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME."
  );
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: dbUser,
    password: dbPassword,
    database: process.env.DB_NAME || "finestapp",
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    logging: process.env.NODE_ENV !== "production",
    entities: [path.join(__dirname, "../entities/*.{ts,js}")],
    migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
    subscribers: [],
});

