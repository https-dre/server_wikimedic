import { drizzle } from "drizzle-orm/node-postgres"
import { medicamento } from "./schema";

export const dr_db = drizzle(process.env.DATABASE_URL);