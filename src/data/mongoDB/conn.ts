// WvEyLSoepVJz6KbU
//mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/
import mongoose from 'mongoose';
import { Client, DB } from "mongodb"

export const mongo = {
  mongoURI : string,
  db : undefined as unknow as DB,

  async conn(): Promise<void>
  {
    mongodb.connect(this.mongoURI)

    const db = mongoose.connection;
    this.db = db
    db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
    db.once('open', () => {
      console.log('Conectado ao MongoDB');
    });
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