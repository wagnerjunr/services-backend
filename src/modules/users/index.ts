import { FastifyInstance } from "fastify";
import { getUsersController } from "./controllers/useGetUsers.js";

export default function UsersModule(app: FastifyInstance) {
  app.register(getUsersController);
}
