import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { z } from "zod";
import { uploadImageService } from "../../../services/uploadMediafile.js";

const UploadImageSchema = z.object({
  file: z.object({
    type: z.literal("file"),
    value: z.instanceof(Buffer),
    filename: z.string(),
    encoding: z.string(),
    mimetype: z.string().startsWith("image/"),
  }),
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
    summary: "Upload de imagem",
    description: "Fazer upload de uma imagem",
    tags: ["images"],
    // response: { 200: responseSchema },
  },
};

export const useUpdateImageController = async (server: FastifyInstance) => {
  server.post("/update", { ...apiRouteDefinition }, updateImageHandler);
};

export const updateImageHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const {file: { value: fileBuffer, mimetype }, } = UploadImageSchema.parse(req.body);

  if (!fileBuffer) {
    return res.status(400).send({
      message: "Nenhuma imagem foi enviada",
    });
  }

  const mediaFile = await uploadImageService({
    fileBuffer,
  });

  return res.status(200).send({
    url: mediaFile.url,
    message: "Imagem atualizada com sucesso",
  });
};
