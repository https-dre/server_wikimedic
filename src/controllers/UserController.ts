import { UserRepository } from "../repositories/UserRepository"
import { User } from "../models/User"
import { Request, Response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface IUserController {
  postUser(req: Request, res: Response): Promise<void>;
  deleteUser(req: Request, res : Response): Promise<void>;
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
  async deleteUser(req : Request, res : Response): Promise<void> {
      try {
        const {id} = req.body
        const userFinded = await this.userRepository.findById(id)
        if(!userFinded)
        {
          res.status(404).json({message: "O usuário não existe"})
        }
        else
        {
          const userDeleted = await this.userRepository.deleteUser(userFinded.id)
          const response = {
            id : userDeleted.id,
            name : userDeleted.name,
            email : userDeleted.email,
            email_reserva : userDeleted.email_reserva,
            password : userDeleted.password,
            deleted : true
          }
          res.status(200).json({response})
        }
        
      }
      catch (err)
      {
        console.log(err)
        res.status(500).json({message: "Erro Interno no servidor"})
      }
  }
  

}