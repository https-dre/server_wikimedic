import { randomUUID } from "crypto";
import { Medicamento, zMedicine } from "../models/Medicamento";
import { IMedRepository } from "../repositories/protocols/IMedRepository";
import { BadRequest } from "../error-handler";
import { mongo } from "../data/mongoDB/conn";
import { S3Provider } from '../providers/S3Provider';

export class MedicService {
  private s3Provider: S3Provider;
  constructor(private repository: IMedRepository) {
    this.s3Provider = new S3Provider();
  }

  async save(data: Omit<Medicamento, "id">) {
    const medToSave: Medicamento = {
      id: randomUUID(),
      ...data
    }

    const saved_med = await this.repository.save(medToSave);
    return saved_med;
  }

  async findById(id: string) {
    const medic = await this.repository.findById(id);

    if (!medic) {
      throw new BadRequest("Medicamento não encontrado", 404);
    }

    return medic;
  }

  async searchByName(name: string) {
    const medicametos = await this.repository.searchByName(name);

    if (medicametos?.length === 0) {
      throw new BadRequest('Nenhum medicamento foi encontrado', 404);
    }

    return medicametos;
  }

  async filterByScope(scope: string, value: string, page: number = 1, limit: number = 10) {
    if (!(scope in zMedicine.shape)) {
      throw new BadRequest("Medicamento não possui este campo.");
    }

    const result = await this.repository.filter(scope, value, page, limit);

    if (result.length == 0) {
      throw new BadRequest("Nada encontrado", 404);
    }

    return result;
  }

  async deleteById(id: string) {
    const medFounded = await this.repository.findById(id);
    if (!medFounded) {
      throw new BadRequest("Medicamento não encontrado", 404);
    }

    await this.repository.delete(id);
  }

  async distinct(field: string) {
    if (!(field in zMedicine.shape)) {
      throw new BadRequest(`Medicamento não possui o campo: ${field}`);
    }
    const result = await mongo.db.collection("Medicamento").distinct(field);
    return result;
  }

  async updateMedicine(id: string, update: any) {
    const medFounded = await this.repository.findById(id);

    if(!medFounded) {
      throw new BadRequest("Medicamento não encontrado", 404);
    }

    await this.repository.update(update, id);
  }
}