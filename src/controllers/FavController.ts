import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Favorito } from '../models/Favorito';

import { IUserRepository } from '../repositories/protocols/IUserRepository';
import { IMedRepository as IMedicamentoRepository } from '../repositories/protocols/IMedRepository';
import { IFavoritoRepository } from '../repositories/protocols/IFavoritoRepository';
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';


export class FavController
{
    favRepository : IFavoritoRepository
    userRepository? : IUserRepository
    medRepository? : IMedicamentoRepository
    
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

        if( this.userRepository != null && this.medRepository != null)
        {
            try
            {
                const userFinded = await this.userRepository.findById(req.body.idUser)
                const medFinded = await this.medRepository.findByNumProcess(req.body.numProcesso)
                //console.log(userFinded)
                //console.log(medFinded)
                if(userFinded != null && medFinded != null)
                {
                    const existente = await this.favRepository.findByUser_Medic(userFinded.id, medFinded.id)
                    if(existente == null)
                    {
                        const newFav : Favorito = {
                            id : uuidv4(),
                            idUser : userFinded.id,
                            idMed: medFinded.id,
                            numProcesso : medFinded.numProcesso
                        }
                        //console.log("New Fav: \n", newFav)
                        const fav = await this.favRepository.postFav(newFav)
                        //console.log(fav)
                        res.status(201).json(fav)
                    }
                    else
                    {
                        res.send("O favorito já existe com o medicamento correspondente").status(400)
                    }
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
        
    }

    async getFav(req: Request, res: Response): Promise<void> 
    {
        try
        {
            
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
                const favs = await this.favRepository.findByIdUser(req.params.id)
                if(favs != null)
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
    async delete(req: Request, res: Response): Promise<void> {
        try {
            if(req.params.id)
            {
                const doc = await this.favRepository.findById(req.params.id)
                if(doc != null)
                {
                    await this.favRepository.delete(doc.id)
                    res.status(200).json({message : "Favorito deletado"})
                }
                else
                {
                    res.status(404).json({message : "Favorito not found"})
                }

            }
            else
            {
                res.status(400).json({message : "Informe um id nos parâmetros da Requisição"})
            }
        } catch (error) {
            
        }
    }
    async getAll(req: Request, res: Response): Promise<void> {
        try
        {
            const favs = await this.favRepository.getAll()
            res.status(200).json(favs)
        }
        catch (error)
        {
            console.log(error)
            res.status(500).json({message : "Erro Interno no Servidor!!"})
        }
    }

    async findFavorito(req : Request, res : Response, medRepository : MedicamentoRepository) : Promise<void>
    {
        try {
            const idUser = req.query.idUser
            const numProcesso = req.query.numProcesso

            const med = await medRepository.findByNumProcess(numProcesso as unknown as string)

            if(med)
            {
                const fav = await this.favRepository.findByUser_Medic(idUser as unknown as string, med.id)
                if(fav)
                {
                    res.status(200).json({
                        favorited : true,
                        message : "Medicamento já favoritado"
                    })
                }
                else
                {
                    res.status(200).json({
                        favorited : false,
                        message : "Medicamento não favoritado"
                    })
                }
            }
            else
            {
                res.status(404).send('Medicamento not found')
            }

            
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro interno no Servidor, aguarde ou contate o administrador')
        }
    }

}
