import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDirForFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export async function writeFileSafe(filePath: string, content: string) {
  await ensureDirForFile(filePath);
  await fs.writeFile(filePath, content, "utf8");
}

export async function writeJson(filePath: string, data: unknown) {
  await writeFileSafe(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

export async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function listJsonFiles(directory: string) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}
