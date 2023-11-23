import express from "express"

import { UserRepository } from "../repositories/mongo/UserRepository";
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';
import { FavoritoRepository } from "../repositories/mongo/FavoritoRepository";
import { CommentRepository } from "../repositories/mongo/CommentRepository";

import { UserController } from "../controllers/UserController"
import { MedController } from "../controllers/MedController"
import { FavController } from '../controllers/FavController';
import { CommentController } from "../controllers/CommentController";

import { Autentication } from '../filters/Autentication';

const Router = express.Router()

Router.get('/', (__req, res)=>{
  res.send("<h1>httpServer to Wikimedic</h1>")
})

Router.post('/users/register', async (req,res) => {
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.postUser(req, res)
})

Router.get('/users', (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.getAllUsers(req, res)
})

Router.get('/users/login', Autentication.AuthUser, (req, res)=>{
  //console.log('Usuário autenticado')
  res.status(200).json({message: "Usuário Autenticado"})
})
 
Router.delete('/users/delete/:id', async (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.deleteUser(req, res)
})

Router.put('/users/update', Autentication.AuthUser, (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.updateUser(req, res)
})

Router.put('/users/update/password', Autentication.AuthUser, (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.updatePassword(req, res)
})

Router.put('/users/recuperar', Autentication.AuthUser,(req, res)=>{
  res.send('<h4>Recuperar Senha<h4>')
})

// Medicamentos

Router.get('/medicamentos', (req, res)=>{
  const medRepository = new MedicamentoRepository()
  const medController = new MedController(medRepository)
  medController.getAll(req, res)
})

Router.post('/medicamentos/register',(req,res)=>{
  const medRepository = new MedicamentoRepository()
  const medController = new MedController(medRepository)
  medController.postMed(req, res)
})

Router.delete('/medicamentos/delete/numProcesso/:numProcesso', (req, res)=>{
  const medRepository = new MedicamentoRepository()
  const medController = new MedController(medRepository)
  medController.deleteByNumProcesso(req, res)
})

Router.post('/medicamentos/validate', (req, res)=>{
  const medRepository = new MedicamentoRepository()
  const medController = new MedController(medRepository)
  medController.validateMed(req, res)
})

//Favorito

Router.get('/favoritos', (req, res)=>{
  const favRepository = new FavoritoRepository()
  const favControler = new FavController(favRepository)
  favControler.getAll(req, res)
})

Router.post('/favoritos/register', (req, res)=>{
  const medRepository = new MedicamentoRepository()
  const favRepository = new FavoritoRepository()
  const userRepository = new UserRepository()
  const favController = new FavController(favRepository,userRepository, medRepository)
  favController.postFav(req, res)
})

Router.get('/favoritos/getByIdUser/:id', (req,res)=>{
  const favRepository = new FavoritoRepository()
  const favController = new FavController(favRepository)
  favController.findByIdUser(req, res)
})

Router.delete('/favoritos/delete/:id',(req, res)=>{
  const favRepository = new FavoritoRepository()
  const favController = new FavController(favRepository)
  favController.delete(req ,res)
})

// comentários
Router.post('/comentarios/register', (req, res)=>{
  const userRepository = new UserRepository()
  const medRepository = new MedicamentoRepository()
  const commentRepository = new CommentRepository()

  const commentController = new CommentController(commentRepository, userRepository, medRepository)
  commentController.postComment(req, res)
})

Router.get('/comentarios/getByIdMed/:id', (req, res)=>{
  const userRepository = new UserRepository()
  const medRepository = new MedicamentoRepository()
  const commentRepository = new CommentRepository()

  const commentController = new CommentController(commentRepository, userRepository, medRepository)
  commentController.findByIdMed(req, res)
})

Router.get('/comentarios/numProcesso/:numProcesso', (req, res)=>{
  const userRepository = new UserRepository()
  const medRepository = new MedicamentoRepository()
  const commentRepository = new CommentRepository()

  const commentController = new CommentController(commentRepository, userRepository, medRepository)
  commentController.findByNumProcesso(req, res)
})



export default Router