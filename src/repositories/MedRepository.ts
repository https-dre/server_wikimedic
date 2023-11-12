import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { Medicamento } from "../models/Medicamento";
import { PostgreController } from "../data/Client";

interface IMedRepository {
    findByNumProcess(numProcesso : string) : Promise<Medicamento | false>;
    postMed(med : Medicamento) : Promise<Medicamento>;
    findById(id : string): Promise<Medicamento | false>;
}

export class MedRepository implements IMedRepository {
    db : PostgreController

    constructor(pg : PostgreController)
    {
        this.db = pg
    }
    async postMed(med: Medicamento): Promise<Medicamento> {
        try {
            const query = `INSERT INTO medicamentos (id, name, numProcesso) VALUES ('${med.id}','${med.name}','${med.numProcesso}');`
            await this.db.run(query)
            console.log(med)
            return med
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

    async findById(id: string): Promise<any> {
        
        const query = `SELECT * FROM medicamentos WHERE id = '${id}'`
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