import "dotenv/config";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const validationError = fromZodError(parsedEnv.error);
  console.error(
    "❌ Invalid environment variables:",
    validationError.toString()
  );
  process.exit(1);
}

export const env = parsedEnv.data;
