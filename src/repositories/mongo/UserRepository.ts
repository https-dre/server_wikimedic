import { User } from '../../models/User';
import { IUserRepository } from "../protocols/IUserRepository";
import { mongo } from "../../data/mongoDB/conn"
import { ObjectId } from "mongodb";
import { toUser } from "../../utils/ToUser"

export class UserRepository implements IUserRepository { //UserRepository usando MongoDb

    constructor()
    {
        
    }
    async postUser(user: User): Promise<User> {
        try
        {
            const UserCollection = mongo.db.collection('User')
            const result = await UserCollection.insertOne(
                {
                    _id : user.id as unknown as ObjectId,
                    name : user.name,
                    email : user.email,
                    email_reserva : user.email_reserva,
                    password : user.password
                }
            )

            // convertendo result para usuário e retornando
            return {
                id : result.insertedId as unknown as string,
                name : user.name,
                email : user.email,
                email_reserva : user.email_reserva,
                password : user.password
            }
        }
        catch (err)
        {
            throw err
        }
        
    }

    async findByEmail(Email: string): Promise<User | null> {
        const UserCollection = mongo.db.collection('User')
        const result = await UserCollection.findOne({email : Email})

        if (result != null) 
        {
            const user = toUser(result); // convertendo para User
            return toUser(result);
        } 
        else 
        {
            return null;
        }
        
    }

    async findById(Id: string): Promise<User | null> {
        const UserCollection = mongo.db.collection('User')
        const result = await UserCollection.findOne({_id : Id as unknown as ObjectId})

        if (result) 
        {
            const user = toUser(result); // convertendo para User
            return user;
        } 
        else 
        {
            return null;
        }
    }

    async getAllUsers(): Promise<User[]> {
        const UserCollection = mongo.db.collection('User')
        const docs = await UserCollection.find().toArray();
        const users = docs.map((doc: any) => toUser(doc));
        return users;
    }

    async deleteUser(Id: string): Promise<void> {
        const UserCollection = mongo.db.collection('User')
        await UserCollection.deleteOne({_id : Id as unknown as ObjectId})
    }
    
    async updateUser(newUser: any, idUser : string): Promise<User> {
        try {
            const UserCollection = mongo.db.collection('User')
            const result = await UserCollection.updateOne({ _id : idUser as unknown as ObjectId }, 
            {
                $set: newUser
            })
            //console.log(result)
            return newUser
        } 
        catch (error) {
            throw error
        }
    }
    async updatePassword(password: string, Id: string): Promise<void> {
        try
        {
            const UserCollection = mongo.db.collection('User')
            await UserCollection.updateOne({ _id : Id as unknown as ObjectId},
                {
                    $set:{
                        password : password
                    }
                })
        }
        catch (error)
        {
            throw error
        }
    }
}