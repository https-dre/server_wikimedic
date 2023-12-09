import { Medicamento } from "../../models/Medicamento";

export interface IMedRepository {
    findByNumRegistro(registro : string) : Promise<Medicamento | null>;
    save(med : Medicamento) : Promise<Medicamento>;
    updateByNumRegistro(med : any, num : string) : Promise<any>;
    findById(id : string): Promise<Medicamento | null>;
    getAll() : Promise<Medicamento[]>;
    delete( Id : string) : Promise<void>;
    deleteByNumRegistro( NumProcesso : string) : Promise<void>
}