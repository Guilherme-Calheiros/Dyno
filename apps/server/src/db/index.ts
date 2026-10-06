import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "./schema/auth.js";
import * as appSchema from "./schema/app.js";

const DATABASE_URL =
    process.env.DATABASE_TARGET === "prod"
        ? process.env.DATABASE_URL_PROD
        : process.env.DATABASE_URL_DEV;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema: { ...authSchema, ...appSchema },
});
