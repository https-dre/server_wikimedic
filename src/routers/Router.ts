import express, { response } from "express"

import Controller from "../controllers/Controller"
import { UserController } from "../controllers/UserController"
import { UserRepository } from "../repositories/UserRepository"
import { Autentication } from "../filters/Autentication"
import { MedRepository } from "../repositories/MedRepository"
import { MedController } from "../controllers/MedController"

const Router = express.Router()

Router.get('/', (__req, res)=>{
  res.send("<h1>httpServer to Wikimedic</h1>")
})

Router.get('/users', Controller.getAllUsers)

Router.get('/users/login', Autentication.AuthUser, (req, res)=>{
  //console.log('Usuário autenticado')
  res.status(200).json({message: "Usuário Autenticado"})
})

Router.post('/users/register', async (req,res) => {
  const userRepository = new UserRepository('./src/data/database.db')

  const userController = new UserController(userRepository)
  userController.postUser(req, res)
})

Router.delete('/users/delete:id', async (req, res)=>{
  const userRepository = new UserRepository('./src/data/database.db')
  const userController = new UserController(userRepository)
  userController.deleteUser(req, res)
})

Router.post('/comments/register',(req,res)=>{
  const medRepository = new MedRepository('./src/data/database.db')
  const medController = new MedController(medRepository)
  medController.postMed(req, res)
})



export default Router