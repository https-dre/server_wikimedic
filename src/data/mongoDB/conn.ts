import { MongoClient, Db } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

export const mongo = {
  client: undefined as unknown as MongoClient,
  db: undefined as unknown as Db,

  async conn(): Promise<void> {
    const url = process.env.MONGO_URL;
    if (!url) {
      console.log("Missing MONGO_URL!");
      process.exit(1);
    } else {
      const client = new MongoClient(url);
      this.client = client;
      await client.connect();
      console.log("MongoDB connected");

      const db = client.db("cluster0");
      this.db = db;
      console.log("Db client created and mongoDB connected");
    }
  },
};
