import express from "express"

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
    const response = await userController.postUser(req)
    res.status(response.status).json(response.body)
  }
  catch (err)
  {
    res.status(500).json({message: "Erro interno no servidor"})
  }
})



export default Router