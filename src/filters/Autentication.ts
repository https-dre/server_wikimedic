import { Request, Response, NextFunction } from "express"
import { UserRepository } from "../repositories/UserRepository"
import * as bcrypt from 'bcrypt';
import { PostgreController } from "../data/Client";
import { User } from "../models/User";

export class Autentication {

    static async AuthUser(req : Request, res : Response, next : NextFunction): Promise<void> {
        const pgController = new PostgreController()
        const userRepository = new UserRepository(pgController)

        const usersFinded = await userRepository.findByEmail(req.body.auth.email)
        if(usersFinded)
        {
            res.status(404).json({message: "User Not Found"})
        }
        else {
            const user = usersFinded

            bcrypt.compare(req.body.auth.password, user.password, (err, result) => {
                
                if(result) 
                {
                    next()
                } 
                else {
                    res.status(400).json({message : "Usuário não autenticado"})                
                }
            })
        }
    }
}