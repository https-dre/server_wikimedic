import Model from "../models/Model"
import { Request, Response } from "express"

const getAllUsers = async (__req : Request, res : Response) => { // rota exclusiva para devs
  try {
    const users = await Model.getAllUsers()  
    return res.status(200).json(users)
  }
  catch (err)
  {
    console.log(err)
    return res.status(500).json({message:"Erro Interno no Servidor"})
    throw err
  }
}



export default { getAllUsers }