import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { prisma } from "../../config/prismaClient.js";
import { decodeJwt } from "jose";

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
    summary: "Atualizar token",
    description: "Atualizar token de um usuario",
    tags: ["Users"],
    // response: { 200: responseSchema },
  },
};

export const refreshTokenController = async (server: FastifyInstance) => {
  server.post("/refresh", { ...apiRouteDefinition }, refreshTokenHandler);
};

export const refreshTokenHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const cookies = req.cookies;
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send({ message: "Refresh token não encontrado" });
  }
try{
  const decoded = decodeJwt(refreshToken);

   const user = await prisma.user.findUnique({
     where: { id: decoded.id as number  },
   });  

   if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).send({ message: 'Invalid refresh token' });
  }

  const newAccessToken = req.server.jwt.sign({ id: user.id,email: user.email },{expiresIn: '15m'});

  return res.status(200).send({ accessToken: newAccessToken },);

}catch(err){
  res.status(401).send({ message: 'Invalid or expired refresh token' });
}
};
