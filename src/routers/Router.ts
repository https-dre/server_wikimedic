import express from "express"

import { UserRepository } from '../repositories/mongo/UserRepository';
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';
import { FavoritoRepository } from "../repositories/mongo/FavoritoRepository";
import { CommentRepository } from "../repositories/mongo/CommentRepository";

import { UserController } from "../controllers/UserController"
import { MedController } from "../controllers/MedController"
import { FavController } from '../controllers/FavController';
import { CommentController } from "../controllers/CommentController";

import { Autentication } from '../filters/Autentication';
import { EmailRepository } from "../repositories/mongo/EmailRepository";

const Router = express.Router()

Router.get('/', (__req, res)=>{
  res.send("<h1>httpServer to Wikimedic</h1>")
})

Router.post('/users/register', async (req,res) => {
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.save(req, res)
})

Router.get('/verificarConta', (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.verificarUsuário(req, res)
})

Router.get('/users', (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.getAllUsers(req, res)
})

Router.post('/users/login', Autentication.AuthUser, async (req, res)=>{
  //console.log('Usuário autenticado')
  const userRepository =  new UserRepository()
  const user = await userRepository.findByEmail(req.body.auth.email)
  
  if(user)
  {
    res.status(200).json({
      message : 'Usuário Autenticado',
      user
    })
  }
  else
  {
    res.status(404).json('User not Found')
  }
})

Router.get('/users/id/:id', (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.getUserById(req, res)
})
 
Router.delete('/users/delete/:id', async (req, res)=>{
  const userRepository = new UserRepository()
  const favRepository = new FavoritoRepository()
  const commentRepository = new CommentRepository()
  const userController = new UserController(userRepository)
  userController.deleteUser(req, res, favRepository, commentRepository)
})

Router.put('/users/update', Autentication.AuthUser, (req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  userController.updateUser(req, res)
})

Router.get('/users/solicitar/recuperacao', (req, res)=>{
  const userRepository = new UserRepository()
  const emailRepository = new EmailRepository()
  const userController = new UserController(userRepository)
  
  userController.solicitarUpdatePassword(req, res, emailRepository)
})

Router.put('/users/recuperar',(req, res)=>{
  const userRepository = new UserRepository()
  const userController = new UserController(userRepository)
  const emailRepository = new EmailRepository()
  userController.updatePassword(req, res, emailRepository)
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
  medController.save(req, res)
})

Router.get('/medicamentos/id/:id', (req, res)=>{
  const medRepository = new MedicamentoRepository()
  const medController = new MedController(medRepository)
  medController.getById(req, res)
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

Router.post('/favoritos/register', Autentication.AuthUser, (req, res)=>{
  const medRepository = new MedicamentoRepository()
  const favRepository = new FavoritoRepository()
  const userRepository = new UserRepository()

  const favController = new FavController(favRepository)
  favController.save(req, res, userRepository, medRepository)
})

Router.get('/favoritos/getByUser/:id', (req,res)=>{
  const favRepository = new FavoritoRepository()
  const medRepository = new MedicamentoRepository()
  const favController = new FavController(favRepository)
  favController.findByIdUser(req, res, medRepository)
})

Router.delete('/favoritos/delete/:id', Autentication.AuthUser,(req, res)=>{
  const favRepository = new FavoritoRepository()
  const userRepository = new UserRepository()
  const favController = new FavController(favRepository)
  favController.delete(req ,res, userRepository)
})

Router.get('/favoritos/validate', Autentication.AuthUser, (req, res)=>{
  const favRepository = new FavoritoRepository()
  const medRepository = new MedicamentoRepository()
  const favController = new FavController(favRepository)
  favController.findFavorito(req ,res, medRepository)
})

// comentários
Router.post('/comentarios/register', Autentication.AuthUser, (req, res)=>{
  const userRepository = new UserRepository()
  const medRepository = new MedicamentoRepository()
  const commentRepository = new CommentRepository()

  const commentController = new CommentController(commentRepository)
  commentController.save(req, res, userRepository, medRepository)
})

Router.get('/comentarios/getByIdMed/:id', (req, res)=>{
  const userRepository = new UserRepository()
  const medRepository = new MedicamentoRepository()
  const commentRepository = new CommentRepository()

  const commentController = new CommentController(commentRepository)
  commentController.findByIdMed(req, res, userRepository, medRepository)
})

Router.get('/comentarios/numProcesso/:numProcesso', (req, res)=>{ // get Comentário por numProcesso
  const userRepository = new UserRepository()
  const medRepository = new MedicamentoRepository()
  const commentRepository = new CommentRepository()

  const commentController = new CommentController(commentRepository)
  commentController.findByNumProcesso(req, res, medRepository, userRepository)
})

export default Router