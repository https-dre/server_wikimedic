import { Email } from "../../models/Email";

export interface IEmailRepository {
    save(mail : Email) : Promise<Email>
    findByEmail(email  : string) : Promise<Email | null>;
    findByIdUser(idUser : string) : Promise<Email | null>;
    deleteByEmail(email : string) : Promise<void>;
    deleteByIdUser(id : string) : Promise<void>;
}

