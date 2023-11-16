import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Favorito } from '../models/Favorito';

import { IUserRepository } from '../repositories/protocols/IUserRepository';
import { IMedRepository as IMedicamentoRepository } from '../repositories/protocols/IMedRepository';
import { IFavoritoRepository } from '../repositories/protocols/IFavoritoRepository';


interface IFavController {
    postFav(req : Request, res : Response): Promise<void>;
    getFav(req : Request, res : Response): Promise<void>;
    findByIdUser(req : Request, res : Response) : Promise<void>;
}

export class FavController implements IFavController
{
    favRepository : IFavoritoRepository
    userRepository : IUserRepository
    medRepository : IMedicamentoRepository
    
    constructor(rep : IFavoritoRepository, repUser? : IUserRepository, md? : IMedicamentoRepository)
    {
        this.favRepository = rep
        if(repUser)
        {
            this.userRepository = repUser
        }
        if(md)
        {
            this.medRepository = md
        }
    }

    async postFav(req: Request, res: Response): Promise<void> {
        try
        {
            //console.log(req.body.numProcesso)
            //console.log(req.body.idUser)

            const userFinded = await this.userRepository.findById(req.body.idUser)
            const medFinded = await this.medRepository.findByNumProcess(req.body.numProcesso)
            //console.log(userFinded)
            //console.log(medFinded)
            if(userFinded != null && medFinded != null)
            {
                const newFav : Favorito = {
                    id : uuidv4(),
                    idUser : userFinded.id,
                    idMed: medFinded.id,
                    numProcesso : medFinded.numProcesso
                }
                console.log("New Fav: \n", newFav)
                const fav = await this.favRepository.postFav(newFav)
                //console.log(fav)
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

    async getFav(req: Request, res: Response): Promise<void> 
    {
        try
        {
            const id = req.params.id
            const fav = 
        }
        catch (err)
        {

        }
    }
    async findByIdUser(req : Request, res : Response) : Promise<void>
    {
        try {
            if(req.params.id)
            {
                const favs = await this.favRepository.findByIdUser(id)
                if(favs.length > 0)
                {
                    res.status(200).json(favs)
                }
                else
                {
                    res.status(404).json({message : "Sem resultados"})
                }
            }
            else
            {
                res.status(400).json({message:"Informe um id de usuário"})
            }
        } catch (error) {
            res.status(500).json({message : "Erro Interno no Servidor"})
        }
    }

}
