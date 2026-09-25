import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL =
    process.env.DATABASE_TARGET === "prod"
        ? process.env.DATABASE_URL_PROD
        : process.env.DATABASE_URL_DEV;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
}

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!
  }
});