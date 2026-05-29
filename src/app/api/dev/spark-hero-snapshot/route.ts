import { writeFile } from "node:fs/promises";
import path from "node:path";
import { isSparkHeroSnapshot } from "@/lib/spark-hero-snapshot";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Dev only" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isSparkHeroSnapshot(body)) {
    return Response.json({ error: "Invalid spark snapshot" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "src/content/spark-hero-snapshot.json");
  await writeFile(filePath, `${JSON.stringify(body, null, 2)}\n`, "utf8");

  return Response.json({ ok: true });
}
