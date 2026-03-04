import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost/dummy");
export const db = drizzle({ client: sql });
