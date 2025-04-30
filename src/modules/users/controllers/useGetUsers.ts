import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { prisma } from "../../../config/prismaClient.js";

const responseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string(),
    })
  ),
});

// Configuração da rota
const apiRouteDefinition: RouteShorthandOptions = {
  schema: {
    summary: "Buscar usuarios",
    description: "Buscar todos usuarios",
    tags: ["Users"],
    response: { 200: responseSchema },
  },
};

export const getUsersController = async (server: FastifyInstance) => {
  server.get("/", { ...apiRouteDefinition }, getUsersHandler);
};

export const getUsersHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const users = await prisma.user.findMany();

  res.status(200).send({ users });
};
