import { UserRepository } from "../repositories/UserRepository"
import { User } from "../models/User"
import { Request, Response } from "express"
import bcrypt from 'bcrypt';

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"

interface IAuthUserController {
  validate(req: Request): Promise<ResponseHttp>;
}

export class AuthUserController implements IAuthUserController{
  userRepository: UserRepository;
  
  constructor(iuser : UserRepository)
  {
    this.userRepository = iuser
    //this.postUser = this.postUser.bind(this);
    //console.log('UserController initialized')
  }
  
  async validate(req : Request) {
    try {
      const user = await this.userRepository.findByEmail(req.body.email)
      if(!user)
      {
        const response: ResponseHttp = {
          body: "User Not Found",
          status: 400
        }
        return response
      }

      if (await bcrypt.compare(req.body.password, user.password)) 
      {
        const response: ResponseHttp = {
          body: user,
          status: 200
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
    
}