import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  try {
    const envFile = fs.readFileSync(path.resolve(".env.local"), "utf-8");
    for (const line of envFile.split("\n")) {
      if (line.startsWith("DATABASE_URL=")) {
        dbUrl = line.replace("DATABASE_URL=", "").trim();
      }
    }
  } catch (e) {}
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl!,
  },
});
