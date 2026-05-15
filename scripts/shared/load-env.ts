import path from "node:path";
import { existsSync } from "node:fs";

type ProcessWithEnvLoader = NodeJS.Process & {
  loadEnvFile?: (file?: string) => void;
};

const processWithEnvLoader = process as ProcessWithEnvLoader;

const envPath = path.join(process.cwd(), ".env");

if (typeof processWithEnvLoader.loadEnvFile === "function" && existsSync(envPath)) {
  processWithEnvLoader.loadEnvFile(envPath);
}
