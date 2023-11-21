import { Comment } from "../models/Comment"

export function toComment(obj : any) : Comment
{
    return {
        id : obj._id,
        idUser : obj.idUser,
        idMed : obj.idMed,
        content : obj.content
    }
}