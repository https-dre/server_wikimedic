import { Request, Response } from "express"
import { Medicamento } from "../models/Medicamento"
import { IMedRepository } from "../repositories/protocols/IMedRepository"


import { mongo } from "../data/mongoDB/conn"

import { v4 as uuidv4 } from 'uuid';
import { toMedic } from "../utils/ToMedicamento";

export class MedController {
    medRepository : IMedRepository

    constructor(med : IMedRepository)
    {
        this.medRepository = med
    }

    async save(req: Request, res :Response): Promise<void> {
        try 
        {
            const medFinded = await this.medRepository.findByNumRegistro(req.body.numRegistro)
            if(medFinded == null)
            {
                //console.log(medFinded)
                const med : Medicamento = {
                    id: uuidv4(),
                    name: req.body.name,
                    numRegistro : req.body.numRegistro,
                    categoria : req.body.categoria,
                    indicacao : req.body.indicacao,
                    contraindicacao : req.body.contraindicacao,
                    cuidados: req.body.cuidados,
                    reacao_adversa : req.body.reacao_adversa,
                    posologia : req.body.posologia,
                    riscos : req.body.riscos,
                    especiais : req.body.especiais,
                    superdose : req.body.superdose
                }
                const medformated = await this.medRepository.save(med);
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
            const medFinded = await this.medRepository.findByNumRegistro(req.body.numRegistro)
            let status = "";
            let medResponse : Medicamento;
            if(medFinded == null)
            {
                //console.log(medFinded)
                const med : Medicamento = {
                    id: uuidv4(),
                    name: req.body.name,
                    numRegistro : req.body.numRegistro,
                    categoria : req.body.categoria,
                    indicacao : req.body.indicacao,
                    contraindicacao : req.body.contraindicacao,
                    cuidados: req.body.cuidados,
                    reacao_adversa : req.body.reacao_adversa,
                    posologia : req.body.posologia,
                    riscos : req.body.riscos,
                    especiais : req.body.especiais,
                    superdose : req.body.superdose
                }
                const medformated = await this.medRepository.save(med);
                status = "Medicamento Registrado Agora"
                medResponse = medformated
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

    async updateByNumRegistro(req : Request, res : Response) : Promise<void>
    {
        try {
            if(req.body.numRegistro && req.body.newMedic)
            {
                const medFinded = await this.medRepository.findByNumRegistro(req.body.numRegistro)

                if(medFinded)
                {
                    const update = await this.medRepository.updateByNumRegistro(req.body.newMedic, req.body.numRegistro)

                    const MedicReponse = await this.medRepository.findByNumRegistro(req.body.numRegistro)
                    res.status(201).json(MedicReponse)
                }
                else
                {
                    res.status(404).json('Medicamento Not Found.')
                }
            }
        } catch (error) {
            res.status(500).json('Erro Interno no Servidor, aguarde ou contate o administrador.')
            console.log(error)
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
            res.status(500).json("Erro Interno no Servidor")
            console.log(err)
        }
    }
    async deleteByNumRegistro(req : Request, res : Response)
    {
        try
        {
            if(req.params.numRegistro)
            {
                const medic = await this.medRepository.findByNumRegistro(req.params.numRegistro)
                if(medic == null)
                {
                    res.status(404).json("Medicamento Not Found")
                }
                else
                {
                    await this.medRepository.deleteByNumRegistro(req.params.numRegistro)
                    res.status(200).json("Medicamento Deletado")
                }
            }
            else
            {
                res.status(400).json("Insira o numRegistro do Medicamento")
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
    async getByNumRegistro(req: Request, res: Response): Promise<void>
    {
        try {
            if(req.query.numRegistro)
            {
                const doc = await mongo.db.collection('Medicamento').findOne({ numRegistro : req.query.numRegistro.toString()})
                if(doc != null)
                {
                    const medic = toMedic(doc)
                    res.status(200).json(medic)
                }
                else
                {
                    res.status(404).json('Medicamento Not FOund')
                }
                
            }
            
        } catch (error) {
            res.status(500).json('Erro Interno no Servidor, aguarde ou contate o administrador.')
            console.log(error)
        }
    }

    async search(req : Request, res : Response) : Promise<void>
    {
        try {
            const medicamentos = await this.medRepository.include(req.body)
            res.status(200).json(medicamentos)
        } catch (error) {
            res.status(500).json('Erro Interno no Servidor, aguarde ou contate o administrador!!')
        }
    }

}