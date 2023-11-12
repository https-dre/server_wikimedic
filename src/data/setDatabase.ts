
import sqlite3 from "sqlite3"
const default_queries = `
  CREATE TABLE users (
    id CHAR(60) PRIMARY KEY,
    name CHAR(255),
    email CHAR(255),
    email_reserva CHAR(255),
    password CHAR(100)
  );
  
  CREATE TABLE medicamentos (
    id CHAR(60) PRIMARY KEY,
    name CHAR(200),
    numProcesso CHAR(200)
  );
`

async function createDatabase() {
  try {
      const db = new sqlite3.Database("src/data/database.db");
      const queryes = default_queries.split(";");
      for(let i = 0 ; i < queryes.length; i++) {
          await new Promise((resolve, reject) => {
              db.run(queryes[i], function(err) {
                 if (err) {
                     reject(err);
                 } else {
                     resolve({});
                 }
              });
          });
      }

      await new Promise((resolve, reject) => {
          db.all(`SELECT * FROM medicamentos`, (err, rows) => {
              if(err) {
                 reject(err);
              } else {
                 console.log(rows);
                 resolve(rows);
              }
          });
      });
  }
  catch (err) {
      console.log(err);
  }
}


createDatabase()
