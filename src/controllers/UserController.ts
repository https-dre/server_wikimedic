import { IUserRepository } from "../repositories/protocols/IUserRepository"
import { FavoritoRepository } from "../repositories/mongo/FavoritoRepository";
import { CommentRepository } from '../repositories/mongo/CommentRepository';

import { User } from "../models/User"

import { Request, Response } from "express"

import { IResponseHttp as ResponseHttp } from "../models/ResponseHttp"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt";
import { EmailRepository } from '../repositories/mongo/EmailRepository';
import { Email } from '../models/Email';

import { transporter as EmailServive } from "../email/Transporter";
import { getRandomInt } from "../utils/RandomInt";

export class UserController {

  userRepository: IUserRepository;

  constructor(iuser: IUserRepository) {
    this.userRepository = iuser
    //this.postUser = this.postUser.bind(this);
    //console.log('UserController initialized')
  }

  async postUser(req: Request, res: Response) {
    if(req.body.email != null && req.body.password != null)
    {
      const password = req.body.password
      if(password.length > 8)
      {
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
            const userCreated = await this.userRepository.save(user)
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
      else
      {
        res.status(400).json('A senha deve ter no mínimo 8 caracteres')
      }
    }
    else
    {
      res.status(400).send('Preencha os cabeçalhos pelo menos: email e password')
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
            res.status(404).json("O usuário não existe")
          }
        }
        else {
          res.status(400).json("Informe o id de Usuário")
        }
      }
      catch (err)
      {
        console.log(err)
        res.status(500).json("Erro Interno no servidor")
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
        res.status(500).json("Erro Interno No Servidor, aguarde ou contate o administrador")
      }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    if(req.body.newUser)
    {
      try {
        const user = await this.userRepository.findByEmail(req.body.auth.email)
        //console.log(user)
        if(user != null)
        {
          if(req.body.newUser.email)
          {
            const emailUser = await this.userRepository.findByEmail(req.body.newUser.id)
            if(emailUser == null)
            {
              const result = await this.userRepository.updateUser(req.body.newUser, user.id)
              res.status(201).json(result)
            }
            else
            {
              res.status(400).json('Email já existe')
            }
          }
          else
          {
              const result = await this.userRepository.updateUser(req.body.newUser, user.id)
              res.status(201).json(result)
          }
        }
        else
        {
          res.status(404).json('User not Found')
        }
      } catch (error) 
      {
        res.status(500).json('Erro interno no servidor, aguarde ou contate o administrador')
        console.log(error)
      }
    }
    else
    {
      res.status(400).json("Informe um objecto newUser no corpo da Requisição")
    }
  }

  async solicitarUpdatePassword( req : Request, res : Response, emailRepository : EmailRepository) : Promise<void>
  {
    try {
      if(req.body.email)
      {
        const userFinded = await this.userRepository.findByEmail(req.body.email)
        
        if(userFinded != null)
        {
          const mailFinded = await emailRepository.findByEmail(userFinded.email)
          if(mailFinded != null && mailFinded.type == 'recuperacao')
          {
            await emailRepository.deleteByEmail(userFinded.email)
          }
          const token = `${getRandomInt(0,10)}${getRandomInt(0,10)}${getRandomInt(0,10)}${getRandomInt(0,10)}${getRandomInt(0,10)}${getRandomInt(0,10)}`
          const email : Email = {
            id : uuidv4(),
            to : userFinded.email,
            token : token,
            date : new Date().toUTCString(),
            type : 'recuperacao'
          }
          var mailOptions = {
            from : process.env.EMAIL,
            to : email.to,
            subject : 'Recuperar Senha Wikimedic',
            text : `Seu código de recuperação é : ${email.token}. \nNão Responda esse email`,
            html : `<center style="fontfamily: Roboto;"> <br> <p>Código de Recuperação Wikimedic</p> <h2>${email.token}</h2> <br> <p>Não Responda esse email</p></center>`
          }
          const doc = await emailRepository.save(email)
          await EmailServive.sendMail(mailOptions)

          res.status(201).json({ 
            message : 'Email de recuperação enviado',
            email : email.to,
            date : email.date
          })
        }
        else
        {
          res.status(404).send('User not found')
        }
        
      }
      else
      {
        res.send('Informe o email')
      }
    } catch (error) {
      console.log(error)
      res.send('Erro interno no Servidor, aguarde ou contate o administrador.').status(500)
    }
  }

  async updatePassword(req: Request, res: Response, emailRepository : EmailRepository): Promise<void> {
    if(req.body.password != null && req.body.email != null && req.body.token != null)
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
              await emailRepository.deleteByEmail(userFinded.email) // deletando emails de recuperação do histórico
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