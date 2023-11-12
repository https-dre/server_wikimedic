import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { Medicamento } from "../models/Medicamento";
import { PostgreController } from "../data/Client";

interface IMedRepository {
    findByNumProcess(numProcesso : string) : Promise<any>;
    postMed(med : Medicamento) : Promise<Medicamento>;
}

export class MedRepository implements IMedRepository {
    db : PostgreController

    constructor(pg : PostgreController)
    {
        this.db = pg
    }
    async postMed(med: Medicamento): Promise<Medicamento> {
        try {
            const formatedMed : Medicamento = {
                id : uuidv4(),
                name : med.name,
                numProcesso: med.numProcesso
            }
            const query = `INSERT INTO medicamentos (id, name, numProcesso) VALUES ('${formatedMed.id}','${formatedMed.name}','${formatedMed.numProcesso}');`
            await this.db.run(query)
            console.log(formatedMed)
            return formatedMed
        }
        catch (err)
        {
            throw err
        }
    }

    async findByNumProcess(numProcesso: string): Promise<any> {
        
            const query = `SELECT * FROM medicamentos WHERE numProcesso = '${numProcesso}'`
            const result = await this.db.get(query)
            if(result.length > 0)
            {
                return result[0]
            }
            else
            {
                return false
            }
    }
}