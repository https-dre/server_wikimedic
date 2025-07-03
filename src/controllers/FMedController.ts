import { FastifyRequest, FastifyReply } from "fastify";
import { Medicamento, zMedicine } from "../models/Medicamento";
import { IMedRepository } from "../repositories/protocols/IMedRepository";
import { v4 as uuidv4 } from "uuid";
import { mongo } from "../data/mongoDB/conn";

export class FMedController {
  constructor(private medRepository: IMedRepository) {}

  async save(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { data } = req.body as { data: Omit<Medicamento, "id"> };

    const medToSave: Medicamento = {
      id: uuidv4(),
      ...data,
    };

    const save_med = await this.medRepository.save(medToSave);
    reply.code(201).send({ data: { id: save_med.id } });
  }

  async getById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as any;

    console.log(`Procurando medicamento ${id}`);
    const medic = await this.medRepository.findById(id);

    if (!medic) {
      return reply.code(404).send({ details: "'Medicamento' not found!" });
    }

    reply.code(200).send({ data: medic });
  }

  async search(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name } = req.params as { name: string };
    const medicamentos = await this.medRepository.searchByName(name);

    if (medicamentos?.length === 0) {
      return reply.code(404).send({ details: "'Medicamento' not found!" });
    }

    return reply
      .code(200)
      .send({ data: medicamentos, dataLength: medicamentos.length });
  }

  async filter(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { scope, value } = req.params as {
      scope: string;
      value: string;
    };

    if (!(scope in zMedicine.shape)) {
      return reply.code(400).send({
        details: `'Medicamento' does not have property '${scope}'`,
        Medicamento: Object.keys(zMedicine.shape),
      });
    }

    const { page, limit } = req.query as {
      page: number;
      limit: number;
    };

    const result = await this.medRepository.filter(scope, value, page, limit);

    if (result.length == 0) {
      return reply.code(404).send("");
    }

    return reply.code(200).send({ data: result, dataLength: result.length });
  }

  async deleteById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };

    const med = await this.medRepository.findById(id);

    if (!med) {
      return reply.code(404).send("Medicine not found!");
    }

    await this.medRepository.delete(id);
    return reply.code(204).send();
  }

  async distinct(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { scope } = req.params as {
      scope: string;
    };

    if (!(scope in zMedicine.shape)) {
      return reply.code(400).send({
        details: `'Medicamento' does not have property '${scope}'`,
        Medicamento: Object.keys(zMedicine.shape),
      });
    }

    const result = await mongo.db.collection("Medicamento").distinct(scope);

    return reply.code(200).send({ data: result });
  }

  async updateMedicine(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = req.params as { id: string };
    const medExists = await this.medRepository.findById(id);
    if (!medExists) {
      return reply.code(404).send("'Medicamento' not found!");
    }
    const { update } = req.body as any;
    await this.medRepository.update(update, id);
    return reply.code(204).send();
  }
}
