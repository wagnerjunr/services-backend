import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { autoCheck } from "../../../utils/authCheck.js";
import { prisma } from "../../../config/prismaClient.js";

const CreateChatSessionSchema = z.object({
  usersId: z.array(z.string()),
});

const responseSchema = z.object({
  message: z.string(),
});

// Configuração da rota
const apiRouteDefinition: RouteShorthandOptions = {
  schema: {
    summary: "Criação de sessão de chat",
    description: "Criação de sessão de chat e colocar usuários na mesma",
    body: CreateChatSessionSchema,
    tags: ["chat"],
    // response: { 200: responseSchema },
  },
};

export const createChatSessionController = async (server: FastifyInstance) => {
  server.post(
    "/create-session",
    { ...apiRouteDefinition, preHandler: autoCheck },
    createChatSessionHandler
  );
};

export const createChatSessionHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { usersId } = CreateChatSessionSchema.parse(req.body);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: usersId,
      },
    },
  });

  if(users.length < 2){
    return res.status(400).send({ message: "Você precisa de pelo menos 2 usuários para criar uma sessão de chat" })
  }

  const chatSession = await prisma.chatSession.create({
    data: {
      is_group:false,
      Chat_Participant: {
        create: usersId.map((userId) => ({ userId })),
      },
    },
    include: {
      Chat_Participant: true, 
    },
  });

  if(!chatSession){
    return res.status(400).send({ message: "Erro ao criar sessão de chat" })
  }

  return res.status(200).send({ message: "Sessão de chat criada com sucesso", chatSession });
};
