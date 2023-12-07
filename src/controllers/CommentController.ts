import { Comment } from "../models/Comment"


import { ICommentRepository } from "../repositories/protocols/ICommentRepository"
import { IMedRepository } from "../repositories/protocols/IMedRepository"
import { IUserRepository } from "../repositories/protocols/IUserRepository"

import { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid';

export class CommentController {
    commentRepository: ICommentRepository
    medRepository?: IMedRepository
    userRepository?: IUserRepository

    constructor(comment: ICommentRepository) {
        this.commentRepository = comment
    }

    async save(req: Request, res: Response, userRepository: IUserRepository, medRepository: IMedRepository): Promise<void> {

        try {
            if (req.body.email != null && req.body.numProcesso != null && req.body.content != null) {

                const user = await userRepository.findByEmail(req.body.email)
                const med = await medRepository.findByNumRegistro(req.body.numRegistro)

                if (user != null && med != null) {
                    const comment: Comment = {
                        id: uuidv4(),
                        idUser: user.id,
                        idMed: med.id,
                        content: req.body.content,
                        created_at: new Date().toUTCString()
                    }
                    const result = await this.commentRepository.save(comment)
                    res.status(201).json(result)
                }
                else if (user == null) {
                    res.status(404).json("User not found")

                }
                else if (med == null) {
                    res.status(404).json("Medicamento not found")
                }
            }
            else {
                res.status(400).json({
                    message: "Preencha todos os campos",
                    req: {
                        email: req.body.email,
                        numProcesso: req.body.numProcesso,
                        content: req.body.content
                    }
                })
            }
        } catch (error) {
            res.status(500).json("Erro interno no Servidor, aguarde ou contate o administrador")
        }
    }

    async findByIdMed(req: Request, res: Response, userRepository: IUserRepository, medRepository: IMedRepository): Promise<void> {
        try {
            if (req.params.id) {
                const med = await medRepository.findById(req.params.id)
                if (med != null) {
                    const comments = await this.commentRepository.findByIdMed(med.id)

                    const resultado = await Promise.all(comments.map(async (c) => {
                        const user = await userRepository.findById(c.idUser);
                        const item = {
                            id: c.id,
                            username: user?.name,
                            content: c.content,
                            created_at: c.created_at
                        };
                        return item;
                    }));

                    res.status(200).json(resultado)
                }
                else {
                    res.status(404).json('Medicamento not Found. Status : ' + 404)
                }
            }

        } catch (error) {
            res.status(500).json("Erro Interno no Servidor, aguade ou contate o administrador")
        }
    }

    async findByNumProcesso(req: Request, res: Response, medRepository: IMedRepository, userRepository: IUserRepository): Promise<void> {

        try {
            if (req.params.numProcesso) {
                const med = await medRepository.findByNumRegistro(req.params.numProcesso)

                if (med != null) {
                    const comments = await this.commentRepository.findByIdMed(med.id)

                    const resultado = await Promise.all(
                        comments.map(async (c) => {
                            const user = await userRepository.findById(c.idUser);
                            if (user != null) {
                                const item = {
                                    id: c.id,
                                    idUser: user.id,
                                    idMed: c.idMed,
                                    username: user.name,
                                    content: c.content,
                                    date: c.created_at
                                };
                                return item;
                            }
                            else // se o usuário for nullo, não deve retornar, se o usuário é null, ele foi deletado
                            {
                                await this.commentRepository.deleteByIdUser(c.idUser)
                                return null
                            }

                        })
                    );
                    res.status(200).json(resultado)
                }
                else {
                    res.status(404).json("Medicamento not found")
                }
            }
            else {
                res.status(400).json("Preencha todos os campos")
            }
        } catch (error) {
            res.status(500).json("Erro interno no Servidor, aguarde ou contate o administrador")
        }
    }
}
