import { Request, Response, NextFunction } from "express"
import { UserRepository } from "../repositories/mongo/UserRepository"
import * as bcrypt from 'bcrypt';

export class Autentication {

    static async AuthUser(req : Request, res : Response, next : NextFunction): Promise<void> {
        const userRepository = new UserRepository()

        const usersFinded = await userRepository.findByEmail(req.body.auth.email)
        if(usersFinded == null)
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
                    res.status(401).json({message : "Usuário não autenticado"})                
                }
            })
        }
    }
}