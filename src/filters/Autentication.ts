import { Request, Response, NextFunction } from "express"
import { UserRepository } from "../repositories/UserRepository"
import * as bcrypt from 'bcrypt';

export class Autentication {

    static async AuthUser(req : Request, res : Response, next : NextFunction): Promise<void> {
        const userRepository = new UserRepository("./src/data/database.db")

        const usersFinded = await userRepository.findByEmail(req.body.auth.email)
        if(usersFinded.length == 0)
        {
            res.status(404).json({message: "User Not Found"})
        }
        else {
            const user = usersFinded[0];
            

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