import { z } from "zod";
import { FMedController } from "../controllers/FMedController";
import { MedicamentoRepository } from "../repositories/mongo/MedicamentoRepository";

import { FastifyInstance } from "fastify";
import { zMedicine } from "../models/Medicamento";

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
      200: zMedicine,
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
    params: z.object({
      scope: z.string(),
    }),
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
  const medController = new FMedController(medRepo);

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
    },
    { prefix: "/medicine" }
  );
};
