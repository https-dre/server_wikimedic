import { EmailToken } from "../../models/EmailToken";

export interface IEmailToken {
    saveToken() : Promise<EmailToken>
}

