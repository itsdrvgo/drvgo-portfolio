import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
    schema: "./src/lib/drizzle/schema.ts",
    driver: "mysql2",
    out: "./drizzle",
    dbCredentials: {
        database: process.env.DATABASE_NAME ?? "",
        host: process.env.DATABASE_HOST ?? "",
        uri: process.env.DATABASE_URL ?? "",
    },
} satisfies Config;
