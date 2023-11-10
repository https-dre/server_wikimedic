import sqlite3 from "sqlite3"

const db = new sqlite3.Database('src/data/data.db')

const query = `
  CREATE TABLE favoritos (
    id CHAR(60) PRIMARY KEY,
    idUser CHAR(60),
    idMed CHAR(60),
    FOREIGN KEY (idUser) REFERENCES users(id),
    FOREIGN KEY (idMed) REFERENCES medicamentos(id)
  );
`

const delet = `
  DELETE FROM users WHERE email = "diaso.andre@outlook.com"
`
// FK notation: FOREIGN KEY(trackartist) REFERENCES artist(artistid)
db.run(delet)

export default db