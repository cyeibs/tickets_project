import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? "0.0.0.0",
  jwtSecret: process.env.JWT_SECRET ?? "change_this_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  maxFileSizeMB: Number(process.env.MAX_FILE_SIZE_MB ?? 10),
};
