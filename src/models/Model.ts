import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"

const getAllUsers = async () => {
  const db = new Database('./src/data/data.db');
  const query = "SELECT * FROM users";

  return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {

          if (err) {
              reject(err);
          } 
          else 
          {
              resolve(rows);
          }
      });
    db.close();
  });
}

const postUser = async ({ name, email, email_reserva, password} : { name : string, email : string, email_reserva : string, password : string}) => {
  const db = new Database('./src/data/data.db');
  
  try {
    const id = uuidv4();
    const hashSenha = await hashPassword(password)
    
    db.serialize( () =>{
      const query = `INSERT INTO users (id, name, email, email_reserva, password) VALUES('${id}', '${name}', '${email}', '${email_reserva}', '${hashSenha}')`
      db.run(query)
    })
    db.close()
    
  }
  catch (err)
  {
    console.log(err)
    throw err
  }
  
}

export default { getAllUsers, postUser }