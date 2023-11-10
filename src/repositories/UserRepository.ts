import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"


interface IUserRepositoryInterface {
  postUser(user: User): Promise<any>;
  findByEmail(email: string): Promise<any>;
}


export class UserRepository implements IUserRepositoryInterface {

  private db: Database

  constructor(dbpath: string) {
    this.db = new Database(dbpath);
    //console.log("IUserRepository initialized")
  }

  async findByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`
      this.db.all(query, [email], (err, rows: any) => {
        if (err) {
          reject(err)
        }
        else {
          if (rows.length > 0) {
            console.log(rows)
            if (rows.length == 1) {
              const user: User = {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                email_reserva: rows[0].email_reserva,
                password: rows[0].password
              }


              resolve(user)
            }
            else {
              
            }
          }
          else {
            resolve({})
          }
        }
      })
    })
  }

  async postUser(user: User): Promise<any> {
    try {
      //const userFinded = findByEmailResponse.body
      // Criando um hash seguro da senha
      const hashedPassword = await hashPassword(user.password);
      console.log('Senha criptografada: ', hashedPassword)
      /*  user = {
         id: uuidv4(),
         password: hashedPassword
       } */
      const formatedUser: User = {
        id: uuidv4(),
        name: user.name,
        email: user.email,
        email_reserva: user.email_reserva,
        password: hashedPassword
      }

      this.db.serialize(() => {
        const query = `INSERT INTO users (id, name, email, email_reserva, password) VALUES('${formatedUser.id}', '${formatedUser.name}', '${formatedUser.email}', '${formatedUser.email_reserva}', '${formatedUser.password}')`;
        this.db.run(query);
      });

      //this.db.close();
      return formatedUser

    }
    catch (err) {
      console.log(err);
      throw err;
    }
  }



}