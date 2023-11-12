import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { FavRepository } from '../repositories/FavoritoRepository';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Favorito } from '../models/Favorito';
import { UserRepository } from '../repositories/UserRepository';
import { MedRepository } from '../repositories/MedRepository';


interface IFavController {
    postFav(req : Request, res : Response):Promise<void>;
}

export class FavController implements IFavController
{
    favRepository : FavRepository
    userRepository : UserRepository
    medRepository : MedRepository
    constructor(rep : FavRepository, repUser : UserRepository, md : MedRepository)
    {
        this.favRepository = rep
        this.userRepository = repUser
        this.medRepository = md
    }

    async postFav(req: Request, res: Response): Promise<void> {
        try
        {
            const userFinded = await this.userRepository.findById(req.body.idUser)
            const medFinded = await this.medRepository.findByNumProcess(req.body.numProcesso)
            if(userFinded && medFinded)
            {
                const newFav : Favorito = {
                    id : uuidv4(),
                    idUser : req.body.idUser,
                    idMed: req.body.idMed,
                    numProcesso : req.body.numProcesso
                }
                const fav = await this.favRepository.postFav(newFav)
                res.status(201).json(fav)
            }
            else if(!userFinded)
            {
                res.status(404).json({message : "User Not Found"})
            }
            else if(!medFinded)
            {
                res.status(404).json({message : "User Not Found"})
            }
            
        }
        catch (err)
        {
            res.status(500).json({message:"Erro Interno no Servidor"})
        }
    }
}
