import { Database } from "sqlite3"
import { v4 as uuidv4 } from 'uuid';
import hashPassword from "../crypt/crypt"
import { User } from "../models/User"
import { Medicamento } from "../models/Medicamento";

interface IMedRepository {
    findByNumProcess(numProcesso : string) : Promise<any>;
    postMed(med : Medicamento) : Promise<Medicamento>;
}

export class MedRepository implements IMedRepository {
    db : Database
    constructor(dbpath : string)
    {
        this.db = new Database(dbpath)
    }
    async postMed(med: Medicamento): Promise<Medicamento> {
        try {
            const formatedMed : Medicamento = {
                id : uuidv4(),
                name : med.name,
                numProcesso: med.numProcesso
            }
            this.db.serialize(()=>{
                const query = `INSERT INTO medicamentos (id, name, numProcesso)
                    VALUES ("${formatedMed.id}","${formatedMed.name}","${formatedMed.numProcesso}")
                `
                this.db.run(query)
            })
            return formatedMed
        }
        catch (err)
        {
            throw err
        }
    }

    async findByNumProcess(numProcesso: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM medicamentos WHERE numProcesso = ?`
            this.db.get(query, [numProcesso], (err, row: any) =>{
                if(err)
                {
                    reject(err)
                }
                else if(row)
                {
                    //console.log(row)
                    resolve(row)
                }
                else
                {
                    resolve({})
                }
            })
        })
    }
}