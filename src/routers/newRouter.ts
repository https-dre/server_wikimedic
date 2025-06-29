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

const filterByCategory = {
    schema: {
        summary: 'Filter medicine by category and value',
        params: z.object({
            category: z.string(),
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
    app.get("/", { schema: {
        summary: "Redirect to /docs"
    }}, (_, reply) => {
        reply.redirect('/docs');
    });

    const medRepo = new MedicamentoRepository();
    const medController = new FMedController(medRepo);

    app.get('/medicine/:id', getById, medController.getById.bind(medController))
    app.get('/medicine/search/:name', search, medController.search.bind(medController))
    app.get('/medicine/:category/:value', filterByCategory, medController.filter.bind(medController)) 
}