import { Medicamento } from "../../models/Medicamento";

export interface IMedRepository {
    findByNumRegistro(registro : string) : Promise<Medicamento | null>;
    save(med : Medicamento) : Promise<Medicamento>;
    updateByNumRegistro(med : any, num : string) : Promise<any>;
    update(update: any, id: string): Promise<void>;
    findById(id : string): Promise<Medicamento | null>;
    getAll() : Promise<Medicamento[]>;
    delete( Id : string) : Promise<void>;
    deleteByNumRegistro( NumProcesso : string) : Promise<void>
    searchByName(name : string) : Promise<Medicamento[]>;
    filter(category: string, value: string, page: 
        number, limit: number): Promise<Medicamento[]>;
}