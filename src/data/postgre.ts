import { Client } from "pg";

const host = "hansken.db.elephantsql.com"
export const client = new Client({
  user: "cbcroqaa",
  host: host,
  database: "cbcroqaa",
  password: "jeGbAvNbK3Ic5bdEKozWHD5jNI7i7pee",
  port: 5432,
});


const main = async () => {
  await client.connect();

  console.log('Sucesso')

  await client.end()
}

main()
