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

CREATE TABLE favoritos (
  id CHAR(60) PRIMARY KEY,
  idUser CHAR(60),
  FOREIGN KEY (idUser) REFERENCES users(id),
  idMed CHAR(60),
  FOREIGN KEY (idMed) REFERENCES medicamentos(id)
);