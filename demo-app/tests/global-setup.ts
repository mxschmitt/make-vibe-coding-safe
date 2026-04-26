import { rmSync } from "node:fs";
import { join } from "node:path";

export default async function globalSetup() {
  const dir = join(process.cwd(), "data");
  rmSync(dir, { recursive: true, force: true });
}
