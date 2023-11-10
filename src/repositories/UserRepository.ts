import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"


interface IUserRepositoryInterface {
  postUser(user : User): Promise<ResponseHttp>;
  findByEmail(email : string) : Promise<ResponseHttp>;
}


export class UserRepository implements IUserRepositoryInterface {

  private db : Database

  constructor(dbpath : string) {
    this.db = new Database(dbpath);
    //console.log("IUserRepository initialized")
  }

  async findByEmail(email: string): Promise<ResponseHttp> {
    return new  Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`
      this.db.all(query, [email], (err, rows: any) => {
        if (err) {
          reject(err)
        }
        else {
          if(rows)
          {
            console.log(rows)
            if(rows.lenght == 1)
              {
                const user: User = {
                  id: rows[0].id,
                  name: rows[0].name,
                  email: rows[0].email,
                  email_reserva: rows[0].email_reserva,
                  password: rows[0].password
                }
                const httpResponse : ResponseHttp = {
                  body: user,
                  status: 200
                }

                resolve(httpResponse)
              }
              else {
                const httpResponse : ResponseHttp = {
                  body: false, // se o usuário não existir, ele retorna o body como falso
                  status: 404
                }
                resolve(httpResponse)
              }
          }
          else
          {
            reject(new Error("Erro no UserRepository.ts"))
          }
        }
      })
    })
  }

  async postUser(user : User): Promise<ResponseHttp> {
    try {

      const findByEmailResponse = await this.findByEmail(user.email)
      
      if(!findByEmailResponse.body) // se o email não existir
      {
        //const userFinded = findByEmailResponse.body
        // Criando um hash seguro da senha
          const hashedPassword = await hashPassword(user.password);
          console.log('chegou até aqui')
         /*  user = {
            id: uuidv4(),
            password: hashedPassword
          } */
          const formatedUser : User = {
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

          const response : ResponseHttp = {
            body: formatedUser,
            status: 201
          }
        return response
      }
      else { // caso o email exista
        const httpResponse : ResponseHttp = {
          body: {message: "Este email já existe"},
          status: 404
        }
        return httpResponse
      }
    } 
    catch (err) {
      console.log(err);
      throw err; 
    }
  }
  
  
  
}