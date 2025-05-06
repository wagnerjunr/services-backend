import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { prisma } from "../../config/prismaClient.js";

const responseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  message: z.string(),
});

// Configuração da rota
const apiRouteDefinition: RouteShorthandOptions = {
  schema: {
    summary: "Deslogar usuario",
    description: "Deslogar com usuario existente",
    tags: ["Users"],
    // response: { 200: responseSchema },
  },
};

export const logoutUserController = async (server: FastifyInstance) => {
  server.post("/logout", { ...apiRouteDefinition }, logoutUserHandler);
};

export const logoutUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const cookies = req.cookies;

  if (!cookies.refreshToken) {
    return res.status(401).send({ message: "Não autorizado" });
  }
  await prisma.user.updateMany({
    where: {
      refreshToken: cookies.refreshToken,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("refreshToken", {
    path: "/",
    domain: "localhost",
  });

  res.clearCookie("acessToken", {
    path: "/",
    domain: "localhost",
  });

  return res.status(200).send({ message: "Logout realizado com sucesso" });
};
