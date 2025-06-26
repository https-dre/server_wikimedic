import { drizzle } from "drizzle-orm/pg-core"
import { medicamento } from "./schema";

export const dr_db = drizzle(process.env.DATABASE_URL);