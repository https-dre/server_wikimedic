import { MongoClient, Db } from "mongodb";
import { logger } from "../../logger";

export const mongo = {
  client: undefined as unknown as MongoClient,
  db: undefined as unknown as Db,

  async conn(): Promise<void> {
    const url = process.env.MONGO_URL;
    if (!url) {
      logger.fatal("Missing MONGO_URL!");
      process.exit(1);
    } else {
      const client = new MongoClient(url);
      this.client = client;
      await client.connect();
      logger.info("MongoDB connected");

      const db = client.db("cluster0");
      this.db = db;
      logger.info("Db client created and mongoDB connected");
    }
  },
};
