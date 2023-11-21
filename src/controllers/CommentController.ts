import { Comment } from "../models/Comment"

import { ICommentRepository } from "../repositories/protocols/ICommentRepository"
import { IMedRepository } from "../repositories/protocols/IMedRepository"
import { IUserRepository } from "../repositories/protocols/IUserRepository"

import { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid';

export class CommentController {
    commentRepository : ICommentRepository
    medRepository? : IMedRepository
    userRepository? : IUserRepository

    constructor(comment : ICommentRepository, user? : IUserRepository, med? : IMedRepository)
    {
        this.commentRepository = comment
        if(user)
        {
            this.userRepository = user
        }
        if(med)
        {
            this.medRepository = med
        }
    }

    async postComment(req : Request, res : Response): Promise<void>
    {
        if( this.userRepository != null && this.medRepository != null)
        {
            try {
                if(req.body.idUser != null && req.body.idMed != null && req.body.content != null)
                {
                    
                    const user = await this.userRepository.findById(req.body.idUser)
                    const med = await this.medRepository.findById(req.body.idMed)
                    
                    if(user != null && med != null)
                    {
                        const comment : Comment = {
                            id : uuidv4(),
                            idUser : req.body.idUser,
                            idMed : req.body.idMed,
                            content : req.body.content
                        }
                        const result = await this.commentRepository.postComment(comment)
                        res.status(201).json(result)
                    }
                    else if (user == null)
                    {
                        res.status(404).json({message : "User not found"})
                        
                    }
                    else if (med == null)
                    {
                        res.status(404).json({message : "Medicamento not found"})
                    }
                }
                else
                {
                    res.status(400).json({ message : "Preencha todos os campos"})
                }
            } catch (error) 
            {
                res.status(500).json({message : "Erro interno no Servidor, aguarde ou contate o administrador"})
            }
        }
        else
        {

            res.status(500).json({message : "Erro interno no Servidor, aguarde ou contate o administrador"})
        }
    }
    async findByIdMed(req : Request, res : Response) : Promise<void>
    {
        if(this.medRepository != null && this.userRepository != null)
        {
            try {
                if(req.params.id)
                {
                    const med = await this.medRepository.findById(req.params.id)
                    if(med != null)
                    {
                        const comments = await this.commentRepository.findByIdMed(req.params.id)
                        
                        const resultado = comments.map(async (c)=> {
                            const user = await this.userRepository?.findById(c.idUser)
                            const item = {
                                id : c.id,
                                username : user?.name,
                                content : c.content
                            }
                            return item
                        })
                        res.status(200).json(resultado)
                    }
                }
            } catch (error) {
                
            }
        }
    }
}