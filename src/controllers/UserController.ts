import { UserRepository } from "../repositories/UserRepository"
import { User } from "../models/User"
import { Request, Response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface IUserController {
  postUser(req: Request, res: Response): Promise<void>;
  //deleteUser(req: Request): Promise<ResponseHttp>;
}

export class UserController implements IUserController {

  userRepository: UserRepository;

  constructor(iuser: UserRepository) {
    this.userRepository = iuser
    //this.postUser = this.postUser.bind(this);
    //console.log('UserController initialized')
  }

  async postUser(req: Request, res: Response) {
    const user: User = {
      id: "",
      name: req.body.name,
      email: req.body.email,
      email_reserva: req.body.email_reserva,
      password: req.body.password
    }

    try {
      //valida se o email já existe
      const users = await this.userRepository.findByEmail(user.email)
      if (users.length == 0) //se a pesquisa retornar um array vazio, não existe usuário com mesmo email
      {
        const userCreated = await this.userRepository.postUser(user)
        const response: ResponseHttp = {
          body: userCreated,
          status: 201
        }
        res.status(response.status).json(response.body)
      }
      else {
        const response: ResponseHttp = {
          body: { message: "O email já existe" },
          status: 404
        }
        res.status(response.status).json(response.body)
      }
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Erro interno o Servidor" })
      throw err
    }
  }
  /* async deleteUser(req: Request) {
    try {
      const user = req.body
      const userFinded = this.userRepository.findByEmail(user.email)
      if(!userFinded)
      {
        const response : ResponseHttp = {
          status: 400,
          body: {message: "User Not Found"}
        }
        return response
      }
      else
      {
        //this.userRepository.deleteUser();
        
      }
    }

    
  }
  catch (err)
  {
    throw err
  } */

}