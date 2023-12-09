import { mongo } from "../../data/mongoDB/conn"
import { IMedRepository } from "../protocols/IMedRepository"
import { toMedic } from "../../utils/ToMedicamento"
import { Medicamento } from "../../models/Medicamento"
import { ObjectId } from "mongodb";

export class MedicamentoRepository implements IMedRepository
{
    async findByNumRegistro(NumProcesso : string) : Promise<Medicamento | null>
    {
        try {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            const doc = await MedicamentoCollection.findOne({numRegistro : NumProcesso})
    
            if(doc)
            {
                const medic = toMedic(doc)
                return medic
            }
            else
            {
                return null
            }
        } catch (error) {
            throw error
        }
    }
    async save(med : Medicamento): Promise<Medicamento>
    {
        try
        {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            const doc = await MedicamentoCollection.insertOne({
                _id : med.id as unknown as ObjectId,
                name : med.name,
                numRegistro : med.numRegistro,
                indicacao : med.indicacao,
                contraindicacao : med.contraindicacao,
                reacao_adversa : med.reacao_adversa,
                posologia : med.posologia,
                riscos : med.riscos,
                especiais : med.especiais
            })

            return {
                id : doc.insertedId as unknown as string,
                name : med.name,
                numRegistro : med.numRegistro,
                indicacao : med.indicacao,
                contraindicacao : med.contraindicacao,
                reacao_adversa : med.reacao_adversa,
                posologia : med.posologia,
                riscos : med.riscos,
                especiais : med.especiais
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
            const doc = await MedicamentoCollection.findOne({_id : Id as unknown as ObjectId})
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
            const medicamentos = docs.map((doc: any) => toMedic(doc))
            return medicamentos
        }
        catch (err)
        {
            throw err
        }
    }
    async delete(Id : string) : Promise<void>
    {
        try
        {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            await MedicamentoCollection.deleteOne({_id : Id as unknown as ObjectId})
        }
        catch (err)
        {
            throw err
        }
    }
    async deleteByNumRegistro(NumProcesso : string) : Promise<void>
    {
        try
        {
            const MedicamentoCollection = mongo.db.collection('Medicamento')
            await MedicamentoCollection.deleteOne({ numRegistro : NumProcesso})
        }
        catch (err)
        {
            throw err
        }
    }
}