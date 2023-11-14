import express from "express"

import { UserRepository } from "../repositories/UserRepository";
import { UserController } from "../controllers/UserController"
import { Autentication } from '../filters/Autentication';
import { MedRepository } from '../repositories/MedRepository';
import { MedController } from "../controllers/MedController"
import { PostgreController } from "../data/Client"
import { FavController } from '../controllers/FavController';
import { FavRepository } from "../repositories/FavoritoRepository";

const Router = express.Router()

Router.get('/', (__req, res)=>{
  res.send("<h1>httpServer to Wikimedic</h1>")
})

Router.get('/users', (req, res)=>{
  const pgController = new PostgreController()
  const userRepository = new UserRepository(pgController)
  const userController = new UserController(userRepository)
  userController.getAllUsers(req, res)
})

Router.get('/users/login', Autentication.AuthUser, (req, res)=>{
  //console.log('Usuário autenticado')
  res.status(200).json({message: "Usuário Autenticado"})
})

Router.post('/users/register', async (req,res) => {

  const pgController = new PostgreController()
  const userRepository = new UserRepository(pgController)
  const userController = new UserController(userRepository)
  userController.postUser(req, res)
})

/* Router.delete('/users/delete:id', async (req, res)=>{
  const pgController = new PostgreController()
  const userRepository = new UserRepository(pgController)
  const userController = new UserController(userRepository)
  userController.deleteUser(req, res)
}) */

Router.post('/medicamentos/register',(req,res)=>{
  const pgController = new PostgreController()
  const medRepository = new MedRepository(pgController)
  const medController = new MedController(medRepository)
  medController.postMed(req, res)
})

/* Router.post('/favoritos/register', Autentication.AuthUser, (req,res)=>{
  const pg = new PostgreController()
  const userRepository = new UserRepository(pg)
  const favRepository = new FavRepository(pg)
  const medRepository = new MedRepository(pg)
  const favController = new FavController(favRepository, userRepository, medRepository)
  favController.postFav(req, res)
}) */

Router.post('/medicamentos/validate', (req, res)=>{
  const pgController = new PostgreController()
  const medRepository = new MedRepository(pgController)
  const medController = new MedController(medRepository)
  medController.validateMed(req, res)
})


export default Router