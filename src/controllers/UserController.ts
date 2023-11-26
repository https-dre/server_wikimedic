import { IUserRepository } from "../repositories/protocols/IUserRepository"
import { FavoritoRepository } from "../repositories/mongo/FavoritoRepository";
import { CommentRepository } from "../repositories/mongo/CommentRepository";

import { User } from "../models/User"

import { Request, Response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt";
import { EmailRepository } from '../repositories/mongo/EmailRepository';
import { Email } from '../models/Email';

import { transporter as EmailServive } from "../email/Transporter";

export class UserController {

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
  async deleteUser(req : Request, res : Response, fav : FavoritoRepository, comment : CommentRepository): Promise<void> {
      try {
        //console.log(req.params.id)
        if(req.params.id)
        {
          const id = req.params.id
          const userFinded = await this.userRepository.findById(id)
          //console.log(userFinded)
          if(userFinded)
          {
            await fav.deleteByIdUser(userFinded.id)
            await fav.deleteByIdUser(userFinded.id)
            await this.userRepository.deleteUser(userFinded.id)
            res.status(200).json({message : "Usuário, favoritos e comentários deletados!"})
            
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
  async updateUser(req: Request, res: Response): Promise<void> {
    if(req.body.user)
    {
      try {
        const user = await this.userRepository.findById(req.body.user.id)
        //console.log(user)
        if(user != null)
        {

          if(req.body.user.email != "")
          {
            const emailUser = await this.userRepository.findByEmail(req.body.user.email)
            if(emailUser == null)
            {
              const result = await this.userRepository.updateUser({
                id : user.id,
                name : req.body.user.name,
                email : req.body.user.email,
                email_reserva : req.body.user.email_reserva,
                password : user.password
              })
              res.status(201).json(result)
            }
            else
            {
              res.send('Email já existe').status(400)
            }
          }
          else
          {
            res.send('Informe o cabeçalho user.email corretamente').status(400)
          }
        }
        else
        {
          res.send('User not found').status(404)
        }
      } catch (error) 
      {
        res.send('Erro interno no servidor, aguarde ou contate o administrador').status(500)
        console.log(error)
      }
    }
    else
    {
      res.send("Informe um objecto User no corpo da Requisição").status(400)
    }
  }
  async updatePassword(req: Request, res: Response, emailRepository : EmailRepository): Promise<void> {
    if(req.body.password != null && req.body.email != null && req.body.token)
    {
      try {
        const userFinded = await this.userRepository.findByEmail(req.body.email)
        if(userFinded)
        {
          const email = await emailRepository.findByEmail(userFinded.email)
          if(email)
          {
            if(email.type == 'recuperacao' && email.token == req.body.token)
            {
              const hash = await hashPassword(req.body.password)

              const userDocUpdated : User = {
                id : userFinded.id,
                name : userFinded.name,
                email : userFinded.email,
                email_reserva : userFinded.email_reserva,
                password : hash
              }

              await this.userRepository.updatePassword(userFinded.id, hash)
              res.status(201).json(userDocUpdated)
            }
            else if(email.token != req.body.token)
            {
              res.send('O token não corresponde').status(400)
            }
          }
          else
          {
            res.send('Email not found').status(404)
          }
        }
        else
        {
          res.send('User not found').status(404)
        }
      } 
      catch (error) {
        res.send('Erro interno no Servidor, aguarde ou contate o administrador')
        console.log(error)
      }
    }
    else if(req.body.id == null || req.body.password == null)
    {
      res.send('Informe credenciais do usuário para a atualização').status(400)
    }
    
  }
  async getUserById(req: Request, res: Response): Promise<void> {
    if(req.params.id)
    {
      try
      {
        const user = await this.userRepository.findById(req.params.id)
        res.status(200).json(user)
      }
      catch (error)
      {
        res.send("Erro interno no Servidor, aguarde ou contate o administrador")
      }
    }
    else
    {
      res.send("Informe um id do Usuário no parâmetro da requisição").status(400)
    }
  }

}