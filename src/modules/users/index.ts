import { FastifyInstance } from "fastify";
import { getUserController } from "./controllers/useGetUser.js";

export default function UsersModule(app: FastifyInstance) {
  app.register(getUserController);
}
