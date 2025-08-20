import { FastifyInstance } from "fastify";
import { UserRepository } from "../repositories/mongo/UserRepository";
import { UserService } from "../services/user-service";
import { JwtProvider } from "../providers/crypto-provider";
import { UserController } from "../controllers/user-controller";
import {
  createUserAccount,
  deleteUser,
  updateUserProfile,
  userLogin,
} from "./schemas/user-schemas";

export const user_routes = (app: FastifyInstance) => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository, new JwtProvider());
  const userController = new UserController(userService);

  app.post(
    "/users",
    { schema: createUserAccount },
    userController.save.bind(userController)
  );
  app.put(
    "/users/login",
    { schema: userLogin },
    userController.loginAndGetToken.bind(userController)
  );
  app.put(
    "/users/profile",
    {
      schema: updateUserProfile,
      preHandler: userController.preHandler.bind(userController),
    },
    userController.updateUser.bind(userController)
  );
  app.delete(
    "/users",
    {
      schema: deleteUser,
      preHandler: userController.preHandler.bind(userController),
    },
    userController.deleteUser.bind(userController)
  );
};
