import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { clientModel } from "../data/postgre"
import { PostgreController } from "../data/Client";

interface IUserRepositoryInterface {
  postUser(user: User): Promise<User>;
  //deleteUser(id : string) : Promise<User>;
  findByEmail(email: string): Promise<any>;
  findById(id  : string):Promise<any>
  getAllUsers(): Promise<User[]>;
}

export class UserRepository implements IUserRepositoryInterface {

  private db: PostgreController

  constructor(pgController : PostgreController) {
    this.db = pgController
  }

  async findByEmail(email: string): Promise<any> {
    const query = `SELECT * FROM users WHERE email = '${email}'`
    const result = await this.db.get(query)

    if(result.length > 0)
    {
      //console.log(result)
      return result[0]
      
    }
    else
    {
      return false
    }
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

      const query = `INSERT INTO users (id, name, email, email_reserva, password)
        VALUES ('${formatedUser.id}','${formatedUser.name}','${formatedUser.email}','${formatedUser.email_reserva}','${formatedUser.password}');
      `
      await this.db.run(query)

      //this.db.close();
      return formatedUser

    }
    catch (err) {
      //console.log(err);
      throw err;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const query = `SELECT * FROM users WHERE id = '${id}'`
      const result = await this.db.get(query)

      if(result.length > 0)
      {
        return result[0]
      }
      else
      {
        return false
      }
    }
    catch (err)
    {
      throw err;
    }    
  }

  async getAllUsers(): Promise<User[]> {
      try 
      {
        const users = await this.db.get("SELECT * FROM users")
        console.log(users)
        return users
      }
      catch (err)
      {
        throw err
      }
  }
}