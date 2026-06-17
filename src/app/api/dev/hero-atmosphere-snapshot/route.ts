import { writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeHeroAtmosphereSnapshot } from "@/lib/hero-atmosphere-snapshot";

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

  const snapshot = normalizeHeroAtmosphereSnapshot(body);
  if (snapshot.version !== 2) {
    return Response.json({ error: "Invalid atmosphere snapshot" }, { status: 400 });
  }

  const filePath = path.join(
    process.cwd(),
    "src/content/hero-atmosphere-snapshot.json",
  );
  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  return Response.json({ ok: true });
}
