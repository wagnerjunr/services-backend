import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { prisma } from "../../config/prismaClient.js";
import bcrypt from "bcrypt";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

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
    summary: "Registrar um usuario",
    description: "Registrar um novo usuario",
    body: bodySchema,
    tags: ["Users"],
    // response: { 200: responseSchema },
  },
};

export const registerUserController = async (server: FastifyInstance) => {
  server.post("/register", { ...apiRouteDefinition }, registerUserHandler);
};

export const registerUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { email, password } = bodySchema.parse(req.body);

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (findUser) {
    return res.status(400).send({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    },
  });

  return res.status(201).send({ user, message: "User created" });
};
