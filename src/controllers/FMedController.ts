import { FastifyRequest, FastifyReply } from "fastify";
import { Medicamento } from "../models/Medicamento";
import { MedicService } from "../services/medic-service";
import { updateMedicine } from "../routers/schemas/medicine-schemas";
import z from "zod";

export class FMedController {
  constructor(private service: MedicService) {}

  async save(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { data } = req.body as { data: Omit<Medicamento, "id"> };
    const saved_medic = await this.service.save(data);
    return reply.code(201).send({ medic: saved_medic });
  }

  async getById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };
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
    const { update } = req.body as z.infer<typeof updateMedicine.schema.body>;
    await this.service.updateMedicine(id, update);
    return reply.code(204).send();
  }

  async filter(req: FastifyRequest, reply: FastifyReply) {
    const { scope, value } = req.body as { scope: string; value: string };
    const { page, limit } = req.query as { page: number; limit: number };
    const result = await this.service.filterByScope(scope, value, page, limit);
    return reply.code(200).send({ data: result, dataLength: result.length });
  }

  async uploadMedImage(req: FastifyRequest, reply: FastifyReply) {
    const { med_id } = req.params as { med_id: string };
    const contentType = req.headers["content-type"];
    if (!contentType?.includes("multipart/form-data"))
      return reply.code(400).send({
        details: "Erro no upload do arquivo",
        err: "Content-Type must be multipart/form-data",
      });

    const file = await req.file();
    if (!file) return reply.code(400).send({ details: "Arquivo não enviado." });
    await this.service.uploadMedicineImage(med_id, file);
    return reply.code(201).send({ details: "Imagem enviada." });
  }
}
