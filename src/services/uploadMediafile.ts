import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { env } from "../env/index.js";
import { prisma } from "../config/prismaClient.js";

interface UploadImageParams {
  fileBuffer: Buffer;
}

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadImageService({
  fileBuffer,
}: UploadImageParams) {

  // Converte a imagem para WebP
  const webpBuffer = await sharp(fileBuffer)
    .webp({ quality: 80 })
    .resize({ width: 1920, height: 1080, fit: "inside" })
    .toBuffer();

  // Gera um nome único para o arquivo
  const fileName = `${Date.now()}.webp`;

  // Prepara e executa o upload para S3
  const uploadCommand = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: webpBuffer,
    ContentType: "image/webp",
  });

  await s3Client.send(uploadCommand);

  // Gera a URL da imagem
  const imageUrl = `teste`;

  // Cria o registro no banco de dados
  const mediaFile = await prisma.mediaFile.create({
    data: {
      url: imageUrl,
      key: fileName,
      name: fileName,
      contentType: "image/webp",
    },
  });

  return mediaFile;
}
