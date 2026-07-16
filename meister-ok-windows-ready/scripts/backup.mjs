import { PrismaClient } from "@prisma/client";
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const sqliteLocation = databaseUrl.startsWith("file:") ? databaseUrl.slice(5) : "";
const databasePath = sqliteLocation ? (path.isAbsolute(sqliteLocation) ? sqliteLocation : path.resolve("prisma", sqliteLocation)) : "";
const backupRoot = process.env.BACKUP_DIR || path.resolve("backups");
const uploadDir = process.env.UPLOAD_DIR || path.resolve("public/uploads");
const intervalHours = Math.max(1, Number(process.env.BACKUP_INTERVAL_HOURS || 24));
const retentionDays = Math.max(1, Number(process.env.BACKUP_RETENTION_DAYS || 14));

if (!databasePath) throw new Error("Backup supports a file-based SQLite DATABASE_URL only");

async function cleanup() {
  const cutoff = Date.now() - retentionDays * 86400000;
  for (const name of await readdir(backupRoot).catch(() => [])) {
    const target = path.join(backupRoot, name);
    if ((await stat(target)).mtimeMs < cutoff) await rm(target, { recursive: true, force: true });
  }
}

async function backup() {
  const db = new PrismaClient();
  await mkdir(backupRoot, { recursive: true });
  try {
    await db.$queryRawUnsafe("PRAGMA wal_checkpoint(FULL)");
  } finally {
    await db.$disconnect();
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const target = path.join(backupRoot, timestamp);
  await mkdir(target, { recursive: true });
  await cp(databasePath, path.join(target, "meister.db"));
  await cp(uploadDir, path.join(target, "uploads"), { recursive: true, force: true });
  await cleanup();
  console.log(`[backup] completed ${timestamp}`);
}

await backup();
if (!process.argv.includes("--once")) setInterval(() => backup().catch(error => console.error("[backup]", error)), intervalHours * 3600000);
