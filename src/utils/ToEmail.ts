import { Email } from "../models/Email";

export function toEmail(obj : any) : Email
{
    return {
        id : obj.id,
        idUser : obj.idUser,
        to : obj.to,
        token : obj.token,
        date : obj.date,
        type : obj.type
    }
}