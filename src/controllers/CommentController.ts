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
        try {
            if(req.body.idUser != null && req.body.idMed != null && req.body.content != null)
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
            else
            {
                res.status(400).json({ message : "Preencha todos os campos"})
            }
        } catch (error) 
        {
            res.status(500).json({message : "Erro interno no Servidor, aguarde ou contate o administrador"})
        }
    }
}