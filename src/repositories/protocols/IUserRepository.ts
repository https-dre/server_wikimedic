import { User } from "../models/User"

export interface IUserRepository {
    postUser(user: User): Promise<User>;
    //deleteUser(id : string) : Promise<User>;
    findByEmail(email: string): Promise<User | false>;
    findById(id  : string):Promise<User | false>
    getAllUsers(): Promise<User[]>;
}