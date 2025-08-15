import { FastifyRequest, FastifyReply } from "fastify";
import { Medicamento } from "../models/Medicamento";
import { MedicService } from "../services/medic-service";

export class FMedController {
  constructor(private service: MedicService) {}

  async save(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { data } = req.body as { data: Omit<Medicamento, "id"> };
    const saved_medic = await this.service.save(data);
    return reply.code(201).send({ medic: saved_medic })
  }

  async getById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as any;
    const medic = await this.service.findById(id);
    reply.code(200).send({ data: medic });
  }

  async search(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name } = req.params as { name: string };
    const result = await this.service.searchByName(name);
    return reply.code(200).send({ data: result, dataLength: result.length });
  }

  async deleteById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
    await this.service.deleteById(id);
    return reply.code(204).send();
  }

  async distinct(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { scope } = req.params as {
      scope: string;
    };
    const result = await this.service.distinct(scope);
    return reply.code(200).send({ data: result });
  }

  async updateMedicine(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = req.params as { id: string };
    const { update } = req.body as { update: any };
    await this.service.updateMedicine(id, update);
    return reply.code(204).send();
  }
}
