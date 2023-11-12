import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { client } from "../data/postgre"



interface IUserRepositoryInterface {
  postUser(user: User): Promise<User>;
  deleteUser(id : string) : Promise<User>;
  findByEmail(email: string): Promise<User[]>;
  findById(id  : string):Promise<User | any>
}


export class UserRepository implements IUserRepositoryInterface {

  private db: Database

  constructor(dbpath: string) {
    this.db = new Database(dbpath);
    //console.log("IUserRepository initialized")
  }

  async findByEmail(email: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`
      this.db.all(query, [email], (err, rows: any) => {
        if (err) {
          reject(err)
        }
        else {
          //console.log("emails: " + rows)
          if (rows.length > 0) {
            //console.log(rows)
            resolve(rows)
          }
          else {
            resolve([])
          }
        }
      })
    })
  }

  async postUser(user: User): Promise<User> {
    try {
      //const userFinded = findByEmailResponse.body
      // Criando um hash seguro da senha
      const hashedPassword = await hashPassword(user.password);
      //console.log('Senha criptografada: ', hashedPassword)
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
  async deleteUser(id: string): Promise<User> {
      try {
        let userR : User
        return new Promise((resolve, reject)=>{
            const query = "SELECT * FROM users WHERE id = ?"
            this.db.get(query, [id], (err, row: any) => {
            if (err) {
              reject(err)
            }
            else {
              if (row) {
                userR  =  {
                  id: row.id,
                  name: row.name,
                  email: row.email,
                  email_reserva: row.email_reserva,
                  password: row.password
                }
              }
            }
          })

          this.db.serialize(()=>{
            const query = `DELETE FROM users WHERE id = ${id}`
            this.db.run(query);
          })
          resolve(userR)
        })
      }
      catch (err)
      {
        throw err
      }
  }

  async findById(id: string): Promise<User | any> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE id = ?`
      this.db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err)
        }
        else {
          console.log(row)
          if (row) {
            //console.log(rows)
            resolve(row)
          }
          else {
            resolve(false)
          }
        }
      })
    })
  }
}