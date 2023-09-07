import { env } from "@/env.mjs";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as AuthSchema from "./schema";

const connection = connect({ url: env.DATABASE_URL });
export const db = drizzle(connection, { schema: AuthSchema });
