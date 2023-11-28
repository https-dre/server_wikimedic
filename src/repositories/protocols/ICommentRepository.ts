import { Comment } from "../../models/Comment"

export interface ICommentRepository
{
    save(comment : Comment): Promise<Comment>;
    findByIdMed(Id : string): Promise<Comment[]>;
    deleteById(Id : string) : Promise<void>;
    deleteByIdUser(IdUser : string) : Promise<void>;
}