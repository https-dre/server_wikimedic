import { Email } from "../../models/Email";

export interface IEmailRepository {
    saveToken(mail : Email) : Promise<Email>
    findByEmail(email  : string) : Promise<Email | null>
}

