export interface IMedRepository {
    findByNumProcess(numProcesso : string) : Promise<Medicamento | null>;
    postMed(med : Medicamento) : Promise<Medicamento>;
    findById(id : string): Promise<Medicamento | null>;
    getAll() : Promise<Medicamento[]>;
}