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
    summary: "Logar usuario",
    description: "Logar com usuario existente",
    body: bodySchema,
    tags: ["Users"],
    // response: { 200: responseSchema },
  },
};

export const loginUserController = async (server: FastifyInstance) => {
  server.post("/login", { ...apiRouteDefinition }, loginUserHandler);
};

export const loginUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { email, password } = bodySchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  // Gere o Access Token e o Refresh Token
  const accessToken = req.server.jwt.sign(
    { id: user.id },
    { expiresIn: "15m" }
  );
  const refreshToken = req.server.jwt.sign(
    { id: user.id },
    { expiresIn: "7d" }
  );

  // Salve o Refresh Token no banco de dados
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // Configure o cookie HTTP-Only
  res
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias   
    })
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutos
    })
    .send({message:'Usuario logado com sucesso' });
};
