import express, { response } from "express"

import Controller from "../controllers/Controller"
import { UserController } from "../controllers/UserController"
import { UserRepository } from "../repositories/UserRepository"

const Router = express.Router()

Router.get('/', (__req, res)=>{
  res.send("<h1>httpServer to Wikimedic</h1>")
})

Router.get('/getAllUsers', Controller.getAllUsers)

Router.post('/sign', async (req,res) => {
  const userRepository = new UserRepository('./src/data/database.db')

  const userController = new UserController(userRepository)
  
  try {
    const responseController =  await userController.postUser(req)
    if(!responseController.body) // se o usuário for cadastrado, o body não será falso
    {
      res.status(400).json({message:"Usuário já existe"})
    }
    else if(responseController.body)
    {
      res.status(responseController.status).json(responseController.body)
    }
    
  }
  catch (err)
  {
    res.status(500).json({message: "Erro interno no servidor"})
    throw err
  }
})



export default Router