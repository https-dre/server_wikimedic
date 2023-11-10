import { UserRepository } from "../repositories/UserRepository"
import { User } from "../models/User"
import { Request, Response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"

interface IUserController {
  postUser(req: Request, res: Response): Promise<ResponseHttp>;
}

export class UserController implements IUserController {

  userRepository: UserRepository;

  constructor(iuser : UserRepository)
  {
    this.userRepository = iuser
    //this.postUser = this.postUser.bind(this);
    //console.log('UserController initialized')
  }

  async postUser(req : Request) {
    const user : User = {
      id: "",
      name: req.body.name,
      email: req.body.email,
      email_reserva: req.body.email_reserva,
      password: req.body.password
    }

    try {
      const userCreated = await this.userRepository.postUser(user)
      const response: ResponseHttp = {
        body: userCreated,
        status: 201
      }
      return response
    }
    catch (err)
    {
      console.log(err)
      throw err
    }
  }
}