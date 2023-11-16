import { mongo } from "../../data/mongoDB/conn"
import { IMedRepository } from "../protocols/IMedRepository"
import { toMedic } from "../../utils/ToMedicamento"
import { Medicamento } from "../../models/Medicamento"
import { ObjectId } from "mongodb";

export class MedicamentoRepository implements IMedRepository
{
    async findByNumProcess(NumProcesso : string) : Promise<Medicamento | null>
    {
        try {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            const doc = await MedicamentoCollection.findOne({numProcesso : NumProcesso as unknown as ObjectId})
            if(doc)
            {
                const medic = toMedic(doc)
                return null
            }
            else
            {
                return null
            }
        } catch (error) {
            throw error
        }
    }
    async postMed(med : Medicamento): Promise<Medicamento>
    {
        try
        {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            const doc = await MedicamentoCollection.insertOne({
                _id : med.id as unknown as ObjectId,
                name : med.name,
                numProcesso : med.numProcesso
            })

            return {
                id : doc.insertedId as unknown as string,
                name : med.name,
                numProcesso : med.numProcesso
            };
            
        }   
        catch (err)
        {
            throw err
        }
    }

    async findById( Id : string) : Promise<Medicamento | null>
    {
        try
        {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            const doc = MedicamentoCollection.findOne({_id : Id as unknown as ObjectId})
            if(doc)
            {
                const medic = toMedic(doc)
                return medic
            }
            else
            {
                return null
            }
        }
        catch (err)
        {
            throw err
        }
    }
    async getAll() : Promise<Medicamento[]>
    {
        try
        {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            const docs = await MedicamentoCollection.find().toArray();
            const medicamentos = docs.map(doc => toMedic(doc))
            return medicamentos
        }
        catch (err)
        {
            throw err
        }
    }
}