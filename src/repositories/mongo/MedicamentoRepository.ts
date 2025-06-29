import { mongo } from "../../data/mongoDB/conn";
import { IMedRepository } from "../protocols/IMedRepository";
import { toMedic } from "../../utils/ToMedicamento";
import { Medicamento } from "../../models/Medicamento";
import { ObjectId } from "mongodb";

export class MedicamentoRepository implements IMedRepository {
  async findByNumRegistro(num: string): Promise<Medicamento | null> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      const doc = await MedicamentoCollection.findOne({ numRegistro: num });

      if (doc) {
        const medic = toMedic(doc);
        return medic;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async save(med: Medicamento): Promise<Medicamento> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      const doc = await MedicamentoCollection.insertOne({
        _id: med.id as unknown as ObjectId,
        name: med.name,
        numRegistro: med.numRegistro,
        categoria: med.categoria,
        indicacao: med.indicacao,
        contraindicacao: med.contraindicacao,
        cuidados: med.cuidados,
        reacao_adversa: med.reacao_adversa,
        posologia: med.posologia,
        riscos: med.riscos,
        especiais: med.especiais,
        superdose: med.superdose,
      });

      return {
        id: doc.insertedId as unknown as string,
        name: med.name,
        numRegistro: med.numRegistro,
        categoria: med.categoria,
        indicacao: med.indicacao,
        contraindicacao: med.contraindicacao,
        cuidados: med.cuidados,
        reacao_adversa: med.reacao_adversa,
        posologia: med.posologia,
        riscos: med.riscos,
        especiais: med.especiais,
        superdose: med.superdose,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateByNumRegistro(med: any, num: string): Promise<any> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      const update = await MedicamentoCollection.updateOne(
        { numRegistro: num },
        { $set: med }
      );

      return update;
    } catch (error) {
      throw error;
    }
  }

  async findById(Id: string): Promise<Medicamento | null> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      const doc = await MedicamentoCollection.findOne({
        _id: Id as unknown as ObjectId,
      });
      if (doc) {
        const medic = toMedic(doc);
        return medic;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async getAll(): Promise<Medicamento[]> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      const docs = await MedicamentoCollection.find().toArray();
      const medicamentos = docs.map((doc: any) => toMedic(doc));
      return medicamentos;
    } catch (err) {
      throw err;
    }
  }
  async delete(Id: string): Promise<void> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      await MedicamentoCollection.deleteOne({ _id: Id as unknown as ObjectId });
    } catch (err) {
      throw err;
    }
  }
  async deleteByNumRegistro(num: string): Promise<void> {
    try {
      const MedicamentoCollection = mongo.db.collection("Medicamento");
      await MedicamentoCollection.deleteOne({ numRegistro: num });
    } catch (err) {
      throw err;
    }
  }

  async searchByName(name: string): Promise<Medicamento[]> {
    const medicine = mongo.db.collection("Medicamento");
    const results = await medicine
      .find({
        name: { $regex: name, $options: "i" }, // 'i' = case-insensitive
      })
      .toArray();

    const medResults = results.map((e) => toMedic(e));
    return medResults;
  }

  async filter(category: string, value: string): Promise<Medicamento[]> {
    const medicine = mongo.db.collection("Medicamento");
    const results = await medicine
      .find({ [category]: { $regex: value, $options: "i" } })
      .toArray();
    const medicineResults = results.map((m) => toMedic(m));
    return medicineResults;
  }
}
