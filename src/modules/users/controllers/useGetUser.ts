import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { prisma } from "../../../config/prismaClient.js";
import { autoCheck } from "../../../utils/authCheck.js";

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
    summary: "Buscar usuario",
    description: "Buscar informações de um usuario",
    tags: ["Users"],
    // response: { 200: responseSchema },
  },
};

export const getUserController = async (server: FastifyInstance) => {
  server.get("/me", { ...apiRouteDefinition,preHandler: autoCheck }, getUserHandler);
};

export const getUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const userId = req.user;
  
  const users = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  res.status(200).send({ users });
};
