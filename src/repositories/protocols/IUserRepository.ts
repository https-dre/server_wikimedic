import { User } from "../../models/User"

export interface IUserRepository {
    save(user: User): Promise<User>;
    deleteUser(id : string) : Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailReserva(email : string) : Promise<User | null>;
    findById(id  : string):Promise<User | null>
    getAllUsers(): Promise<User[]>;
    updateUser(newUser : any, idUser : string) : Promise<User>;
    updatePassword(password : string, Id : string): Promise<void>;
}