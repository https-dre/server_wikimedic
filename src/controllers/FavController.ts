import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Favorito } from '../models/Favorito';

import { IUserRepository } from '../repositories/protocols/IUserRepository';
import { IMedRepository as IMedicamentoRepository } from '../repositories/protocols/IMedRepository';
import { IFavoritoRepository } from '../repositories/protocols/IFavoritoRepository';


interface IFavController {
    postFav(req : Request, res : Response): Promise<void>;
    getFav(req : Request, res : Response): Promise<void>;
}

export class FavController implements IFavController
{
    favRepository : IFavoritoRepository
    userRepository : IUserRepository
    medRepository : IMedicamentoRepository
    constructor(rep : IFavoritoRepository, repUser : IUserRepository, md : IMedicamentoRepository)
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
            if(userFinded != null && medFinded != null)
            {
                const newFav : Favorito = {
                    id : uuidv4(),
                    idUser : userFinded.id,
                    idMed: medFinded.id,
                    numProcesso : medFinded.numProcesso
                }
                const fav = await this.favRepository.postFav(newFav)
                res.status(201).json(fav)
            }
            else if(userFinded == null)
            {
                res.status(404).json({message : "User Not Found"})
            }
            else if(medFinded == null)
            {
                res.status(404).json({message : "Medicamento Not Found"})
            }
            
        }
        catch (err)
        {
            res.status(500).json({message:"Erro Interno no Servidor"})
        }
    }

    async getFav(req: Request, res: Response): Promise<void> {
        try
        {
            const idUser = req.params
        }
        catch (err)
        {

        }
    }

}
