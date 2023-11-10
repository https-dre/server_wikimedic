import { Client } from "pg";

const host = "postgresql://adm_wikimedic:9Bu79lkLaJalPFEc66G2RVag20FeZNoH@dpg-cl23qq0p2gis73819140-a.oregon-postgres.render.com/wikimedic_db"
const client = new Client({
  user: "adm_wikimedic",
  host: host,
  database: "wikimedic_db",
  password: "9Bu79lkLaJalPFEc66G2RVag20FeZNoH",
  port: 5432,
});

client.connect();

export default client;