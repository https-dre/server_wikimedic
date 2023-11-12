-- Active: 1698968975733@@hansken.db.elephantsql.com@5432@cbcroqaa@public
CREATE TABLE users (
    id CHAR(60) PRIMARY KEY NOT NULL,
    name CHAR(255) NOT NULL,
    email CHAR(100) UNIQUE NOT NULL,
    email_reserva CHAR(100),
    password CHAR(255) NOT NULL
);

CREATE TABLE medicamentos (
    id CHAR(60) PRIMARY KEY,
    name CHAR(255),
    numProcesso CHAR(255) NOT NULL
)

CREATE TABLE favoritos (
  id CHAR(60),
  idUser CHAR(60),
  idMed CHAR(60),
  FOREIGN KEY (idUser) REFERENCES users(id),
  FOREIGN KEY (idMed) REFERENCES medicamentos(id)
);

CREATE TABLE comentarios (
  id CHAR(60) PRIMARY KEY,
  content CHAR(300) NOT NULL,
  created_at CHAR(100) NOT NULL,
  idUser CHAR(60) NOT NULL,
  idMed CHAR(60) NOT NULL,
  FOREIGN KEY (idUser) REFERENCES users(id),
  FOREIGN KEY (idMed) REFERENCES medicamentos(id)
);

ALTER ROLE cbcroqaa CONNECTION LIMIT -1;