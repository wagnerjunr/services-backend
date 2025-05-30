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
  ChatSessions: z.array(
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
    summary: "Buscar dados de uma sessão de chat",
    description: "Buscar dados de uma sessão de chat e seus participantes",
    tags: ["ChatSessions"],
    // response: { 200: responseSchema },
  },
};

export const getChatSessionController = async (server: FastifyInstance) => {
  server.get("/", { ...apiRouteDefinition,preHandler: autoCheck }, getChatSessionHandler);
};

export const getChatSessionHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {

};
