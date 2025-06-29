import { FastifyRequest, FastifyReply } from "fastify";
import { Medicamento } from "../models/Medicamento";
import { IMedRepository } from "../repositories/protocols/IMedRepository";
import { v4 as uuidv4 } from "uuid";
import { MedicamentoRepository } from "../repositories/mongo/MedicamentoRepository";

export class FMedController {
  constructor(private medRepository: IMedRepository) {}

  async save(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { med } = req.body as any;

    const medToSave: Medicamento = {
      id: uuidv4(),
      ...med,
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

    reply.code(201).send({ data: medic });
  }

  async search(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name } = req.params as { name: string };
    const medicamentos = await this.medRepository.searchByName(name);

    if (medicamentos?.length === 0) {
      return reply.code(404).send({ details: "'Medicamento' not found!" });
    }

    return reply.code(200).send(medicamentos);
  }

  async filter(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { category, value } = req.params as {
      category: string;
      value: string;
    };

    const result = await this.medRepository.filter(category, value);

    if (result.length == 0) {
      return reply.code(404).send('')
    }

    return reply.code(200).send({ data: result})
  }
}
