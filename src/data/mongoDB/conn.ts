// WvEyLSoepVJz6KbU
//mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/
import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://root:WvEyLSoepVJz6KbU@cluster0.ioeey37.mongodb.net/';

mongoose.connect(mongoURI)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

export default db