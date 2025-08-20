import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { BadResponse } from "../error-handler";
import { User } from "../models/User";
import { JwtProvider } from "../providers/crypto-provider";
import { IUserRepository } from "../repositories";

export class UserService {
  constructor(private repository: IUserRepository, public jwt: JwtProvider) {}

  async saveUser(data: Omit<User, "id">) {
    if (!(await this.repository.findByEmail(data.email)))
      throw new BadResponse("E-mail já cadastrado.");

    if (data.password.length < 8) {
      throw new BadResponse("A senha deve ter mais de 8 caracteres.");
    }
    await this.repository.save(data);
  }

  async deleteUser(email: string) {
    const userWithEmail = await this.repository.findByEmail(email);
    if (!userWithEmail) throw new BadResponse("Usuário não encontrado.", 404);
    await this.repository.delete(userWithEmail.id);
  }

  async updateWithEmail(
    email: string,
    updatedFields: Partial<Omit<User, "id">>
  ) {
    const userWithEmail = await this.repository.findByEmail(email);
    if (!userWithEmail)
      return new BadResponse("Nenhum usuário encontrado.", 404);

    await this.repository.updateById(userWithEmail.id, updatedFields);
  }

  async genAuth(email: string, password: string, tokenAge?: "1h") {
    const userWithEmail = await this.repository.findByEmail(email);
    if (!userWithEmail) throw new BadResponse("E-mail não encontrado.", 404);

    if (!(userWithEmail.password == password))
      throw new BadResponse("Senha ou e-mail incorretos.", 403);

    const token = this.jwt.generateToken({ email }, tokenAge);
    return token;
  }

  async checkToken(token: string) {
    try {
      const payload = this.jwt.verifyToken(token) as { email: string };
      if (!(await this.repository.findByEmail(payload.email)))
        throw new BadResponse("E-mail não registrado, sessão inválida.", 403);
      return payload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new BadResponse("Sessão expirou.", 403);
      }
      if (err instanceof JsonWebTokenError) {
        throw new BadResponse("Sessão inválida.", 403);
      }
      throw err;
    }
  }
}
