import { Comment } from "../../models/Comment"

export interface ICommentRepository
{
    postComment(comment : Comment): Promise<Comment>;
    findByIdMed(Id : string): Promise<Comment[]>;
}