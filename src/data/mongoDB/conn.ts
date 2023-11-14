// WvEyLSoepVJz6KbU
//mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/
import { MongoClient, Db } from "mongodb"

export const mongo = {
  client : undefined as unknown as MongoClient,
  db : undefined as unknown as Db,

  async conn(): Promise<void> {
    try {
      const client = new MongoClient('mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/');
      this.client = client;
      await client.connect();
      console.log('MongoDB connected')

      const db = client.db('myDatabase');
      this.db = db;
      console.log('db client created and mongoDB connected')
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