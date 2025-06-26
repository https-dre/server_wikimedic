import { Readable, Writable } from 'stream';
import { dr_db } from './drizzle-schemas/conn';
import { MongoClient } from 'mongodb';

const run = async () => {

    const client = new MongoClient(process.env.MONGO_URL);

    await client.connect();

    const db = client.db('cluster0');

    const collection = db.collection('Medicamento');

    const cursor = collection.find({});

    const results = await cursor.toArray();

    console.log(results);
    console.log(results.length);


    client.close();
}

run();