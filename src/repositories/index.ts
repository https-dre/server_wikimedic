import { Medicamento, MedicineImage } from "../models/Medicamento";
import { User } from "../models/User";

export interface IMedRepository {
  findByNumRegistro(registro: string): Promise<Medicamento | null>;
  save(med: Medicamento): Promise<Medicamento>;
  updateByNumRegistro(med: any, num: string): Promise<any>;
  update(update: any, id: string): Promise<void>;
  findById(id: string): Promise<Medicamento | null>;
  getAll(): Promise<Medicamento[]>;
  delete(Id: string): Promise<void>;
  deleteByNumRegistro(NumProcesso: string): Promise<void>
  searchByName(name: string): Promise<Medicamento[]>;
  filter(category: string, value: string, page:
    number, limit: number): Promise<Medicamento[]>;
  insertImage(id: string, image: MedicineImage): Promise<void>;
}

export interface IUserRepository {
  save(data: Omit<User, "id">): Promise<void>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateById(id: string, update: Partial<Omit<User, "id">>): Promise<void>;
}