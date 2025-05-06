import type { FastifyReply, FastifyRequest } from "fastify";
import { decodeJwt } from "jose";

export async function autoCheck(req: FastifyRequest, res: FastifyReply) {
  const cookies = req.cookies;
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send({ message: "Refresh token não encontrado" });
  }
  const decoded = decodeJwt(refreshToken);

  if (!decoded) {
    return res.status(401).send({ message: "Refresh token inválido" });
  }

  const accessToken = decoded.id as string;
  req.user = accessToken;

  res.setCookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutos
  });
  return
}

declare module "fastify" {
  interface FastifyRequest {
    user: string;
  }
}