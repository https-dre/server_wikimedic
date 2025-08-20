import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/user-service";
import { User } from "../models/User";

export class UserController {
  constructor(private service: UserService) {}

  async save(req: FastifyRequest, reply: FastifyReply) {
    const { data } = req.body as { data: Omit<User, "id"> };
    await this.service.saveUser(data);
    return reply
      .code(201)
      .send({ details: "Conta criada, tente realizar login." });
  }

  async loginAndGetToken(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = req.body as { email: string; password: string };
    const token = await this.service.genAuth(email, password);
    return reply
      .code(201)
      .send({ details: "Login realizado com sucesso!", token });
  }

  async preHandler(req: FastifyRequest, reply: FastifyReply) {
    const auth_header = req.headers["authorization"];
    if (!auth_header?.startsWith("Bearer "))
      return reply.code(400).send({
        details: "Sessão inválida.",
        err: "Authorization must start with 'Bearer '",
      });
    const token = auth_header.split(" ")[1];
    req.contextData = { token };
    const jwtPayload = await this.service.checkToken(token);
    req.contextData.jwtPayload = jwtPayload;
    // continua a requisição
  }

  async deleteUser(req: FastifyRequest, reply: FastifyReply) {
    if (!req.contextData)
      return reply.code(500).send({ details: "Erro interno do servidor." });

    const context = req.contextData as Required<typeof req.contextData>;
    await this.service.deleteUser(context.jwtPayload.email);
    return reply.code(204).send();
  }

  async updateUser(req: FastifyRequest, reply: FastifyReply) {
    if (!req.contextData)
      return reply.code(500).send({ details: "Erro interno no servidor." });
    const context = req.contextData as Required<typeof req.contextData>;
    const { updatedFields } = req.body as {
      updatedFields: Partial<Omit<User, "id">>;
    };
    await this.service.updateWithEmail(context.jwtPayload.email, updatedFields);
    return reply.code(200).send({ details: "Perfil atualizado." });
  }
}
