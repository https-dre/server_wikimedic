import { Request, Response } from "express"
import { Medicamento } from "../models/Medicamento"
import { IMedRepository } from "../repositories/protocols/IMedRepository"

import { v4 as uuidv4 } from 'uuid';

export class MedController {
    medRepository : IMedRepository

    constructor(med : IMedRepository)
    {
        this.medRepository = med
    }

    async postMed(req: Request, res :Response): Promise<void> {
        try 
        {
            const medFinded = await this.medRepository.findByNumProcess(req.body.numProcesso)
            if(medFinded == null)
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
                res.status(200).json("Medicamento já existe no sistema")
            }

        }
        catch (err)
        {
            console.log(err)
            res.status(500).json("Erro Interno no Servidor")
        }
    }
    async validateMed(req: Request, res: Response): Promise<void> {
        try
        {
            const medFinded = await this.medRepository.findByNumProcess(req.body.numProcesso)
            let status = "";
            let medResponse : Medicamento;
            if(medFinded == null)
            {
                //console.log(medFinded)
                const med : Medicamento = {
                    id: uuidv4(),
                    name: req.body.name,
                    numProcesso : req.body.numProcesso
                }
                const medformated = await this.medRepository.postMed(med);
                status = "Medicamento Registrado Agora"
                medResponse = medformated
                //res.status(201).json(medformated)
            }
            else
            {
                //medicamento já foi cadastrado no sistema
                status = "Medicamento Já foi Cadastrado No Sistema"
                medResponse = medFinded
            }
            const response = {
                message : "Medicamento Validado",
                validacao_status : status,
                med : medResponse
            }
            res.status(201).json(response)
        }
        catch (err)
        {
            console.log(err)
            res.status(500).json("Erro Interno no Servidor, Provável Erro de Conexões Limitadas")
        }
    }
    async getAll( req : Request, res : Response) : Promise<void>
    {
        try
        {
            const medics = await this.medRepository.getAll()
            res.status(200).json(medics)
        }
        catch (err)
        {
            console.log(err)
            res.status(500).json("Erro Interno no Servidor")
        }
    }
    async deleteByNumProcesso(req : Request, res : Response)
    {
        try
        {
            if(req.params.numProcesso)
            {
                const medic = await this.medRepository.findByNumProcess(req.params.numProcesso)
                if(medic == null)
                {
                    res.status(404).json("Medicamento Not Found")
                }
                else
                {
                    await this.medRepository.deleteByNumProcesso(req.params.numProcesso)
                    res.status(200).json("Medicamento Deletado")
                }
            }
            else
            {
                res.status(400).json("Insira o numProcesso do Medicamento")
            }
        }
        catch (err)
        {
            throw err
        }
    }
    async getById(req: Request, res: Response): Promise<void> {
        if(req.params.id)
        {
            try {
                const medic = await this.medRepository.findById(req.params.id)
                res.status(200).json(medic)
            } 
            catch (error) {
                res.status(500).json('Erro interno no servidor, aguarde ou contate o administrador')
                console.log(error)
            }
        }
    }

}