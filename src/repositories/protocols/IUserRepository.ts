import { User } from "../../models/User"

export interface IUserRepository {
    postUser(user: User): Promise<User>;
    deleteUser(id : string) : Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id  : string):Promise<User | null>
    getAllUsers(): Promise<User[]>;
}