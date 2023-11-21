import { ICommentRepository } from "../protocols/ICommentRepository";
import { Comment } from "../../models/Comment"
import { mongo } from "../../data/mongoDB/conn"
import { ObjectId } from "mongodb";
import { toComment } from "../../utils/ToComment";

export class CommentRepository implements ICommentRepository
{
    async postComment(comment: Comment): Promise<Comment> {
        try {
            const CommentCollection = mongo.db.collection('Comment')
            const result = await CommentCollection.insertOne({
                _id : comment.id as unknown as ObjectId,
                idUser : comment.idUser,
                idMed : comment.idMed,
                content : comment.content
            })

            const commentResult : Comment = {
                id : result.insertedId as unknown as string,
                idUser : comment.idUser,
                idMed : comment.idMed,
                content : comment.content
            }
            return commentResult
        } catch (error) {
            throw error
        }
    }
    async findByIdMed(IdMed: string): Promise<Comment[]> {
        try {
            const CommentCollection = mongo.db.collection('Comment')
            const docs = await CommentCollection.find({ idMed : IdMed }).toArray()
            const comments = docs.map(doc => toComment(doc))
            return comments

        } catch (error) {
            throw error
        }
    }
    async deleteById(Id: string): Promise<void> {
        try {
            const CommentCollection = mongo.db.collection("Comment")
            await CommentCollection.deleteOne({ _id : Id as unknown as ObjectId})
        } catch (error) {
            throw error
        }
    }
}