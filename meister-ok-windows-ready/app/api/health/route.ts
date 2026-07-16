import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "ok", time: new Date().toISOString() });
  } catch {
    return Response.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}
