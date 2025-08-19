import { logger } from "./logger";

const EnvConfig = new Map<string, string>(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  )
);

const vars = ["MONGO_URL", "SUPABASE_URL", "SUPABASE_KEY"];

export const verify_env = () => {
  logger.info("Checking environment...");
  const missingVars = vars.filter((v) => !EnvConfig.has(v));
  if (missingVars.length) {
    logger.fatal(`Missing: ${missingVars.join(", ")}`);
    process.exit(1);
  }
  logger.info("Environment ok!");
};

export default EnvConfig;

