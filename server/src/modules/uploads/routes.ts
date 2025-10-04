import { FastifyInstance } from "fastify";
import path from "node:path";
import fs from "node:fs";
import { env } from "../../config/env";

export async function uploadsRoutes(app: FastifyInstance) {
  app.post(
    "/uploads",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === "file") {
          const ext = path.extname(part.filename ?? "file");
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}${ext}`;
          const storagePath = path.join(env.uploadDir, fileName);
          const writeStream = fs.createWriteStream(storagePath);
          let size = 0;
          await new Promise<void>((resolve, reject) => {
            part.file.on("data", (chunk) => {
              size += chunk.length;
            });
            part.file.pipe(writeStream);
            writeStream.on("finish", () => resolve());
            writeStream.on("error", (err) => reject(err));
          });

          const media = await app.prisma.media.create({
            data: {
              fileName: part.filename ?? fileName,
              mimeType: part.mimetype ?? "application/octet-stream",
              size,
              storagePath: fileName,
            },
          });

          return reply
            .code(201)
            .send({ id: media.id, url: `/uploads/${fileName}` });
        }
      }
      return reply.code(400).send({ error: "No file provided" });
    }
  );
}
