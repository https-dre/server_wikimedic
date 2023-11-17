// WvEyLSoepVJz6KbU
//mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/
import { MongoClient, Db } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()

export const mongo = {
  client : undefined as unknown as MongoClient,
  db : undefined as unknown as Db,

  async conn(): Promise<void> {
    try {
      const url = process.env.MONGO_URL
      if (!url) {
        throw new Error("A variável de ambiente MONGO_URL não está definida.");
      }
      else
      {
        const client = new MongoClient(url as unknown as string);
        this.client = client;
        await client.connect();
        console.log('MongoDB connected')

        const db = client.db('cluster0');
        this.db = db;
        console.log('Db client created and mongoDB connected')
      }
    } 
    catch (error) {
      console.error("Error connecting to MongoDB", error);
    }
   }
}

/* const mongoURI = 'mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/';

mongoose.connect(mongoURI)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

export default db */