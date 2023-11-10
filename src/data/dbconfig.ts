import sqlite3 from "sqlite3"

const db = new sqlite3.Database('src/data/database.db')

const query = `
  CREATE TABLE favoritos (
    id CHAR(60) PRIMARY KEY,
    idUser CHAR(60),
    idMed CHAR(60),
    FOREIGN KEY (idUser) REFERENCES users(id),
    FOREIGN KEY (idMed) REFERENCES medicamentos(id)
  );
`



// FK notation: FOREIGN KEY(trackartist) REFERENCES artist(artistid)
//db.run()



export default db