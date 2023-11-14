export interface IMedRepository {
    findByNumProcess(numProcesso : string) : Promise<Medicamento | false>;
    postMed(med : Medicamento) : Promise<Medicamento>;
    findById(id : string): Promise<Medicamento | false>;
}