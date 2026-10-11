import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schemas/*.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? 'sqlite.db'
  }
});
