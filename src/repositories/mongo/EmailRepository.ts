import { Email } from "../../models/Email";
import { IEmailRepository } from "../protocols/IEmailRepository";

import { transporter as EmailServive } from "../../email/Transporter";

import { mongo } from "../../data/mongoDB/conn";

import { ObjectId } from "mongodb";
import { toEmail } from "../../utils/ToEmail";

export class EmailRepository implements IEmailRepository
{

    async save(mail : Email): Promise<Email> {
        try {
            const EmailCollection = mongo.db.collection('Email')
            const result = await EmailCollection.insertOne({
                _id : mail.id as unknown as ObjectId,
                idUser : mail.idUser,
                to : mail.to,
                token : mail.token,
                date : mail.date,
                type : mail.type
            })

            const doc : Email = {
                id : result.insertedId as unknown as string,
                idUser : mail.idUser,
                to : mail.to,
                token : mail.token,
                date : mail.date,
                type : mail.type
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
                to : email
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
    async deleteByEmail(email: string): Promise<void> {
        try {
            const EmailCollection = mongo.db.collection('Email')
            await EmailCollection.deleteOne({ to : email})
        } catch (error) {
            throw error
        }
    }

    async findByIdUser(idUser: string): Promise<Email | null> {
        try {
            const EmailCollection = mongo.db.collection('Email')
            const doc = await EmailCollection.findOne({ idUser : idUser})
            if(doc)
            {
                return toEmail(doc)
            }
            else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async deleteByIdUser(id: string): Promise<void> {
        try {
            const EmailCollection = mongo.db.collection('Email')
            await EmailCollection.deleteOne({ idUser : id})
        } catch (error) {
            throw error
        }
    }
}