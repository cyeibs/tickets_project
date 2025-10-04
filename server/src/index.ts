import { buildApp } from "./app";
import { env } from "./config/env";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const app = buildApp();

  const uploadDir = path.join(process.cwd(), env.uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await app.listen({ port: env.port, host: env.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
