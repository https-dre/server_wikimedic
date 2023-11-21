import { ICommentRepository } from "../protocols/ICommentRepository";
import { Comment } from "../../models/Comment"
import { mongo } from "../../data/mongoDB/conn"
import { ObjectId } from "mongodb";

export class CommentRepository implements ICommentRepository
{
    async postComment(comment: Comment): Promise<Comment> {
        try {
            const CommentCollection = mongo.db.collection('Comment')
            const result = await CommentCollection.insertOne({
                _id : comment.id as unknown as ObjectId,
                idUser : comment.idUser,
                idMed : comment.idMed
            })

            const commentResult : Comment = {
                id : result.insertedId as unknown as string,
                idUser : comment.idUser,
                idMed : comment.idMed
            }
            return commentResult
        } catch (error) {
            throw error
        }
    }
}