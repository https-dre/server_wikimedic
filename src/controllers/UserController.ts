import { UserRepository } from "../repositories/UserRepository"
import { User } from "../models/User"
import { Request, Response, response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface IUserController {
  postUser(req: Request, res: Response): Promise<ResponseHttp>;
  //deleteUser(req: Request): Promise<ResponseHttp>;
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
      const userFinded = this.userRepository.findByEmail(user.email)
      if(!userFinded)
      {
        const userCreated = await this.userRepository.postUser(user)
        const response: ResponseHttp = {
          body: userCreated,
          status: 201
        }
        return response
      }
      else {
        const response : ResponseHttp = {
          body: {},
          status: 404
        }
        return response
      }
    }
    catch (err)
    {
      console.log(err)
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