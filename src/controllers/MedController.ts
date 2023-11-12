import { Request, Response } from "express"
import { Medicamento } from "../models/Medicamento"
import { MedRepository } from "../repositories/MedRepository"
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { v4 as uuidv4 } from 'uuid';

interface IMedController {
    //postMed(req : Request, res : Response) : Promise<Medicamento>;
}

export class MedController implements IMedController {
    medRepository : MedRepository

    constructor(med : MedRepository)
    {
        this.medRepository = med
    }

    async postMed(req: Request, res :Response): Promise<void> {
        try 
        {
            const medFinded = await this.medRepository.findByNumProcess(req.body.numProcesso)
            if(!medFinded)
            {
                //console.log(medFinded)
                const med : Medicamento = {
                    id: uuidv4(),
                    name: req.body.name,
                    numProcesso : req.body.numProcesso
                }
                const medformated = await this.medRepository.postMed(med);
                res.status(201).json(medformated)
            }
            else
            {
                res.status(200).json({message : "Medicamento já existe no sistema"})
            }

        }
        catch (err)
        {
            console.log(err)
            res.status(500).json({message: "Erro Interno no Servidor"})
        }
    }
}