import { z } from "zod";
import { FMedController } from "../controllers/FMedController";
import { MedicamentoRepository } from "../repositories/mongo/MedicamentoRepository";

import { FastifyInstance } from "fastify";
import { zMedicine } from "../models/Medicamento";
import { MedicService } from "../services/medic-service";

const search = {
  schema: {
    summary: "Search an medicine by name",
    params: z.object({
      name: z.string(),
    }),
    response: {
      200: z.object({
        data: z.array(zMedicine),
        dataLength: z.number(),
      }),
    },
  },
};

const getById = {
  schema: {
    summary: "Get medicine by id",
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        data: zMedicine
      }),
    },
  },
};

const filterByScope = {
  schema: {
    summary: "Filter medicine by scope and value",
    params: z.object({
      scope: z.string(),
      value: z.string(),
    }),
    query: z.object({
      page: z.coerce.number().default(0),
      limit: z.coerce.number().default(10),
    }),
    response: {
      200: z.object({
        data: z.array(zMedicine),
        dataLength: z.number(),
      }),
    },
  },
};

const postMedicine = {
  schema: {
    summary: "Create an medicine",
    body: z.object({
      med: zMedicine.omit({ id: true }),
    }),
    response: {
      201: z.object({
        id: z.string().uuid(),
      }),
    },
  },
};

const deleteMedicine = {
  schema: {
    summary: "Delete an medicine by id",
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      204: z.null(),
    },
  },
};

const distinctMedicine = {
  schema: {
    summary: "Get distinct values",
    params: z.object({
      scope: z.string(),
    }),
  },
};

const zMedicineOptional = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  numRegistro: z.string().optional(),
  categoria: z.string().optional(),
  indicacao: z.string().optional(),
  contraindicacao: z.string().optional(),
  reacao_adversa: z.string().optional(),
  cuidados: z.string().optional(),
  posologia: z.string().optional(),
  riscos: z.string().optional(),
  especiais: z.string().optional(),
  superdose: z.string().optional(),
});

const updateMedicine = {
  schema: {
    summary: "Update an medicine",
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      update: zMedicineOptional.omit({ id: true }),
    }),
    response: {
      204: z.null()
    }
  },
};

export const routes = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      schema: { summary: "Redirect to /docs" },
    },
    (_, reply) => {
      reply.redirect("/docs");
    }
  );

  const medRepo = new MedicamentoRepository();
  const medService = new MedicService(medRepo);
  const medController = new FMedController(medService);

  // Grupo de rotas com prefixo /medicine
  app.register(
    async (medicineRoutes) => {
      medicineRoutes.get(
        "/:id",
        getById,
        medController.getById.bind(medController)
      );

      medicineRoutes.get(
        "/search/:name",
        search,
        medController.search.bind(medController)
      );

      medicineRoutes.get(
        "/:scope/:value",
        filterByScope,
        medController.filter.bind(medController)
      );

      medicineRoutes.get(
        "/distinct/:scope",
        distinctMedicine,
        medController.distinct.bind(medController)
      );

      medicineRoutes.post(
        "/",
        postMedicine,
        medController.save.bind(medController)
      );

      medicineRoutes.delete(
        "/:id",
        deleteMedicine,
        medController.deleteById.bind(medController)
      );

      medicineRoutes.put(
        "/:id",
        updateMedicine,
        medController.updateMedicine.bind(medController)
      );
    },
    { prefix: "/medicine" }
  );
};
