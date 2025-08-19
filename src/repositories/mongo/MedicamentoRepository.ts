import { mongo } from "../../data/mongoDB/conn";
import { IMedRepository } from "../.";
import { toMedic } from "../../utils/ToMedicamento";
import { Medicamento, MedicineImage } from "../../models/Medicamento";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

export class MedicamentoRepository implements IMedRepository {
  async findByNumRegistro(num: string): Promise<Medicamento | null> {
    const MedicamentoCollection = mongo.db.collection("Medicamento");
    const doc = await MedicamentoCollection.findOne({ numRegistro: num });
    if (!doc) return null;

    return toMedic(doc);
  }
  async save(med: Omit<Medicamento, "id">): Promise<Medicamento> {
    const MedicamentoCollection = mongo.db.collection("Medicamento");
    const doc = await MedicamentoCollection.insertOne({
      _id: randomUUID() as unknown as ObjectId,
      ...med,
    });

    return toMedic(doc);
  }

  async findById(Id: string): Promise<Medicamento | null> {
    const MedicamentoCollection = mongo.db.collection("Medicamento");
    const doc = await MedicamentoCollection.findOne<
      Medicamento & { _id: ObjectId }
    >({
      _id: Id as unknown as ObjectId,
    });
    if (!doc) return null;

    return doc;
  }
  async getAll(): Promise<Medicamento[]> {
    const MedicamentoCollection = mongo.db.collection("Medicamento");
    const docs = await MedicamentoCollection.find().toArray();
    const medicamentos = docs.map((doc) => toMedic(doc));
    return medicamentos;
  }
  async delete(Id: string): Promise<void> {
    const MedicamentoCollection = mongo.db.collection("Medicamento");
    await MedicamentoCollection.deleteOne({ _id: Id as unknown as ObjectId });
  }

  async filter(
    category: string,
    value: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Medicamento[]> {
    const medicine = mongo.db.collection<Medicamento>("Medicamento");
    let results: Medicamento[] = [];

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

    const medicineResults = results.map((m) => toMedic(m));
    return medicineResults;
  }

  async update(
    update: Partial<Omit<Medicamento, "id">>,
    id: string
  ): Promise<void> {
    const medicine = mongo.db.collection("Medicamento");
    await medicine.updateOne(
      { _id: id as unknown as ObjectId },
      { $set: update }
    );
  }

  async insertImage(id: string, image: MedicineImage): Promise<void> {
    const medicine = mongo.db.collection<Medicamento>("Medicamento");
    await medicine.updateOne(
      { _id: id as unknown as ObjectId },
      {
        $push: {
          images: {
            key: image.key,
            url: image.url,
          },
        },
      }
    );
  }
}
