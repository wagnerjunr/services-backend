import { FastifyInstance } from "fastify";
import { registerUserController } from "./registerUser.js";
import { loginUserController } from "./loginUser.js";
import { logoutUserController } from "./logoutUser.js";
import { refreshTokenController } from "./refreshToken.js";

export default function AuthModule(app: FastifyInstance) {
  app.register(registerUserController);
  app.register(loginUserController);
  app.register(logoutUserController)
  app.register(refreshTokenController)
}
