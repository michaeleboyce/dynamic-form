import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { 
    url: process.env.NEON_DATABASE_URL! 
  },
} satisfies Config;