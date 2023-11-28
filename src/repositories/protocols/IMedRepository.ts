import { Medicamento } from "../../models/Medicamento";

export interface IMedRepository {
    findByNumProcess(numProcesso : string) : Promise<Medicamento | null>;
    save(med : Medicamento) : Promise<Medicamento>;
    //updateById(med : Medicamento) : Promsise<Medicamento>;
    findById(id : string): Promise<Medicamento | null>;
    getAll() : Promise<Medicamento[]>;
    delete( Id : string) : Promise<void>;
    deleteByNumProcesso( NumProcesso : string) : Promise<void>
}