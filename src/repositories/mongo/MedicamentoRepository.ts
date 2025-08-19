import { mongo } from "../../data/mongoDB/conn";
import { IMedRepository } from "../.";
import { toMedic } from "../../utils/ToMedicamento";
import { Medicamento, MedicineImage } from "../../models/Medicamento";
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
      const doc = await MedicamentoCollection.findOne<
        Medicamento & { _id: ObjectId }
      >({
        _id: Id as unknown as ObjectId,
      });
      if (!doc) return null;

      return doc;
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
      .find<Medicamento & { _id: ObjectId }>({
        name: { $regex: name, $options: "i" }, // 'i' = case-insensitive
      })
      .toArray();

    return results.map((med) => toMedic(med));
  }

  async filter(
    category: string,
    value: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Medicamento[]> {
    const medicine = mongo.db.collection("Medicamento");
    let results: any = [];

    if (page == 0) {
      results = await medicine
        .find({ [category]: { $regex: value, $options: "i" } })
        .toArray();
    } else {
      const skip = (page - 1) * limit;
      results = await medicine
        .find({ [category]: { $regex: value, $options: "i" } })
        .skip(skip)
        .limit(limit)
        .toArray();
    }

    const medicineResults = results.map((m: any) => toMedic(m));
    return medicineResults;
  }

  async update(update: any, id: string): Promise<void> {
    const medicine = mongo.db.collection("Medicamento");
    await medicine.updateOne(
      { _id: id as unknown as ObjectId },
      { $set: update }
    );
    //const medUpdated = await medicine.findOne({ _id: new ObjectId(id)})

    //return toMedic(medUpdated);
  }

  async insertImage(id: string, image: MedicineImage): Promise<void> {
    const medicine = mongo.db.collection("Medicamento");
    await medicine.updateOne(
      { _id: id as unknown as ObjectId },
      {
        $push: {
          images: {
            key: image.key,
            url: image.url,
          },
        } as any,
      }
    );
  }
}
