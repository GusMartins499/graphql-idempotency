import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schemas/*.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? 'database.db'
  }
});
