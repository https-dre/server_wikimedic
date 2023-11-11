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
  userController.postUser(req, res)
})
Router.delete('/users/delete?id')



export default Router