import { FastifyInstance } from "fastify";
import { useUpdateImageController } from "./controller/useUpdateMediafile.js";

export default function MediaFileModule(app: FastifyInstance) {
    app.register(useUpdateImageController)
}
