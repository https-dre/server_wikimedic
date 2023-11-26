import { Email } from "../../models/Email";
import { IEmailRepository } from "../protocols/IEmailRepository";

import { transporter as EmailServive } from "../../email/Transporter";

import { mongo } from "../../data/mongoDB/conn";

import { getRandomInt } from "../../utils/RandomInt";
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";
import { toEmail } from "../../utils/ToEmail";

export class EmailRepository implements IEmailRepository
{

    async saveToken(mail : Email): Promise<Email> {
        try {
            const emailModel : Email = {
                id : uuidv4(),
                to : mail.to,
                token : getRandomInt(100, 200).toString(),
                date : new Date().toUTCString(),
                type : mail.type
            }
            const EmailCollection = mongo.db.collection('Email')
            const result = await EmailCollection.insertOne({
                _id : emailModel.id as unknown as ObjectId,
                to : emailModel.to,
                token : emailModel.token,
                date : emailModel.date,
                type : emailModel.type
            })

            const doc : Email = {
                id : result.insertedId as unknown as string,
                to : emailModel.to,
                token : emailModel.token,
                date : emailModel.date,
                type : emailModel.type
            }
            return doc

        } catch (error) {
            throw error
        }
    }

    async findByEmail(email: string): Promise<Email | null> {
        try {
            const EmailCollection = mongo.db.collection('Email')
            const doc = await EmailCollection.findOne({
                email : email
            })
            if(doc)
            {
                const mail = toEmail(doc)
                return mail
            }
            else
            {
                return null
            }
        } catch (error) {
            throw error
        }
    }
}