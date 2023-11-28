import { Request, Response, NextFunction } from "express"
import { UserRepository } from "../repositories/mongo/UserRepository"
import * as bcrypt from 'bcrypt';

export class Autentication {

    static async AuthUser(req : Request, res : Response, next : NextFunction): Promise<void> {
        if(req.body.auth != null && req.body.auth.email != null && req.body.auth.password != null)
        {
            const userRepository = new UserRepository()

            const usersFinded = await userRepository.findByEmail(req.body.auth.email)
            if(usersFinded == null)
            {
                res.status(404).json("User Not Found")
            }
            else {
                const user = usersFinded

                bcrypt.compare(req.body.auth.password, user.password, (err, result) => {
                    
                    if(result) 
                    {
                        next()
                    } 
                    else {
                        res.status(401).json("Usuário não autenticado")                
                    }
                })
            }
        }
        else
        {
            res.status(400).json('Preencha todos os campos de autorização (auth)')
        }
    }
}