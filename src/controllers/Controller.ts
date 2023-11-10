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
    throw err
  }
}



export default { getAllUsers }