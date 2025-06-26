import { MedController } from "../controllers/MedController";
import { MedicamentoRepository } from '../repositories/mongo/MedicamentoRepository';

export const routes = async (app: FastifyInstance) => {
    app.get("/medicamentos", { }, (req, reply) => {
        
    })
}