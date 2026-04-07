import path from "node:path";

type ProcessWithEnvLoader = NodeJS.Process & {
  loadEnvFile?: (file?: string) => void;
};

const processWithEnvLoader = process as ProcessWithEnvLoader;

if (typeof processWithEnvLoader.loadEnvFile === "function") {
  processWithEnvLoader.loadEnvFile(path.join(process.cwd(), ".env"));
}
