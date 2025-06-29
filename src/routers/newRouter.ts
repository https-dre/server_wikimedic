import { z } from "zod";
import { FMedController } from "../controllers/FMedController";
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';

import { FastifyInstance } from 'fastify';
import { zMedicine } from "../models/Medicamento";

const search = {
    schema: {
        summary: 'Search an medicine by name',
        params: z.object({
            name: z.string()
        }),
        response: {
            200: z.array(zMedicine)
        }
    }
}

const getById = {
    schema: {
        summary: 'Get medicine by id',
        params: z.object({
            id: z.string()
        }),
        response: {
            200: zMedicine
        }
    }
}

const filterByScope = {
    schema: {
        summary: 'Filter medicine by scope and value',
        params: z.object({
            scope: z.string(),
            value: z.string(),
        }),
        response: {
            200: z.object({
                data: z.array(zMedicine)
            })
        }
    }
}

export const routes = async (app: FastifyInstance) => {
  app.get("/", {
    schema: { summary: "Redirect to /docs" }
  }, (_, reply) => {
    reply.redirect('/docs');
  });

  const medRepo = new MedicamentoRepository();
  const medController = new FMedController(medRepo);

  // Grupo de rotas com prefixo /medicine
  app.register(async (medicineRoutes) => {
    medicineRoutes.get('/:id', getById, medController.getById.bind(medController));
    medicineRoutes.get('/search/:name', search, medController.search.bind(medController));
    medicineRoutes.get('/:scope/:value', filterByScope, medController.filter.bind(medController));
  }, { prefix: '/medicine' });
}