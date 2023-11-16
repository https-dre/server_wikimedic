import { IUserRepository } from "../repositories/protocols/IUserRepository"
import { User } from "../models/User"
import { Request, Response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt";

interface IUserController {
  postUser(req: Request, res: Response): Promise<void>;
  deleteUser(req: Request, res : Response): Promise<void>;
  getAllUsers(req : Request, res : Response): Promise<void>;
}

export class UserController implements IUserController {

  userRepository: IUserRepository;

  constructor(iuser: IUserRepository) {
    this.userRepository = iuser
    //this.postUser = this.postUser.bind(this);
    //console.log('UserController initialized')
  }

  async postUser(req: Request, res: Response) {

    
    const user: User = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      email_reserva: req.body.email_reserva,
      password: await hashPassword(req.body.password)
    }

    try {
      //valida se o email já existe
      const userFinded = await this.userRepository.findByEmail(user.email)
      if (userFinded == null) // se o usuário não existir, será nullo
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
          status: 400
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
        //console.log(req.params.id)
        if(req.params.id)
        {
          const id = req.params.id
          const userFinded = await this.userRepository.findById(id)
          //console.log(userFinded)
          if(userFinded)
          {
            await this.userRepository.deleteUser(userFinded.id)
            res.status(200).json({message : "Usuário deletado!"})
            
          }
          else
          {
            res.status(404).json({message: "O usuário não existe"})
          }
        }
        else {
          res.status(400).json({message : "Informe o id de Usuário"})
        }
      }
      catch (err)
      {
        console.log(err)
        res.status(500).json({message: "Erro Interno no servidor"})
      }
  }
  async getAllUsers(req: Request, res: Response): Promise<void> {
      try {
        const users = await this.userRepository.getAllUsers()
        res.status(200).json(users)
      }
      catch (err)
      {
        console.log(err)
        res.status(500).json({message : "Erro Interno No Servidor"})
      }
  }
  

}