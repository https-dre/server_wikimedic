import { Comment } from "../../models/Comment"

export interface ICommentRepository
{
    postComment(comment : Comment): Promise<Comment>;
    findByIdUser(Id : string): Promise<Comment[]>;
}