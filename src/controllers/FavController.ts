import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Favorito } from '../models/Favorito';

import { IUserRepository } from '../repositories/protocols/IUserRepository';
import { IMedRepository, IMedRepository as IMedicamentoRepository } from '../repositories/protocols/IMedRepository';
import { IFavoritoRepository } from '../repositories/protocols/IFavoritoRepository';
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';
import { User } from '../models/User';


export class FavController
{
    favRepository : IFavoritoRepository
    
    constructor(rep : IFavoritoRepository, repUser? : IUserRepository, md? : IMedicamentoRepository)
    {
        this.favRepository = rep
    }

    async save(req: Request, res: Response, userRepo : IUserRepository, medRepo : IMedRepository): Promise<void> {


            try
            {
                const userFinded = await userRepo.findByEmail(req.body.email)
                const medFinded = await medRepo.findByNumProcess(req.body.numProcesso)
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
                        const fav = await this.favRepository.save(newFav)
                        //console.log(fav)
                        res.status(201).json(fav)
                    }
                    else
                    {
                        res.status(400).json("O favorito já existe com o medicamento correspondente")
                    }
                }
                else if(userFinded == null)
                {
                    res.status(404).json( "User Not Found")
                }
                else if(medFinded == null)
                {
                    res.status(404).json("Medicamento Not Found")
                }
                
            }
            catch (err)
            {
                res.status(500).json("Erro Interno no Servidor, aguarde ou contate o administrador")
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
    async findByIdUser(req : Request, res : Response, medRepo : IMedRepository) : Promise<void>
    {
        try {
            if(req.params.id)
            {
                const favs = await this.favRepository.findByIdUser(req.params.id)
                if(favs != null)
                {
                    const result = await Promise.all(
                        favs.map(async (fav) =>{
                            const med = await medRepo.findById(fav.idMed)
                            if(med)
                            {
                                return {
                                    medic :{
                                        id : fav.idMed,
                                        name : med.name,
                                        numProcesso : med.numProcesso
                                    },
                                    idUser : fav.idUser
                                }
                            }
                            else
                            {
                                return "Medicamento Deletado out Not Found"
                            }
                        })
                    );
                    res.status(200).json(result)
                }
                else
                {
                    res.status(404).json("Sem resultados")
                }
            }
            else
            {
                res.status(400).json("Informe um id de usuário")
            }
        } catch (error) {
            res.status(500).json("Erro Interno no Servidor")
        }
    }
    async delete(req: Request, res: Response, userRepository : IUserRepository): Promise<void> {
        try {
            if(req.params.id)
            {
                const user = await userRepository.findByEmail(req.body.auth.email)
                const fav = await this.favRepository.findById(req.params.id)

                if(user != null && fav != null)
                {
                    if(user.id == fav.idUser)
                    {
                        await this.favRepository.delete(fav.id)
                        res.status(200).json( "Favorito deletado")
                    }
                    else
                    {
                        res.status(404).json( "Favorito not found")
                    }
                }
                else if(user == null)
                {
                    res.status(404).json("User Not Found")
                }
                else if(fav == null)
                {
                    res.status(404).json("Favorito Not Found")
                }
            }
            else
            {
                res.status(400).json( "Informe um id nos parâmetros da Requisição")
            }
        } catch (error) {
            throw error
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
            res.status(500).json("Erro Interno no Servidor!!")
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
                res.status(404).json('Medicamento not found')
            }

            
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no Servidor, aguarde ou contate o administrador')
        }
    }

}
