import { MedController } from "../controllers/MedController";
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';

import { FastifyInstance } from 'fastify';

export const routes = async (app: FastifyInstance) => {
    app.get("/", { schema: {
        summary: "Redirect to /docs"
    }}, (_, reply) => {
        reply.redirect('/docs');
    });
}