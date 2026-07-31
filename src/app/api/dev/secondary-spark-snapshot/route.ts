import { writeFile } from "node:fs/promises";
import path from "node:path";
import { isSecondarySparkSnapshot } from "@/lib/secondary-spark-snapshot";

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

  if (!isSecondarySparkSnapshot(body)) {
    return Response.json({ error: "Invalid secondary spark snapshot" }, { status: 400 });
  }

  const filePath = path.join(
    process.cwd(),
    "src/content/secondary-spark-snapshot.json",
  );
  await writeFile(filePath, `${JSON.stringify(body, null, 2)}\n`, "utf8");

  const variantPath = path.join(
    process.cwd(),
    "src/content/secondary-background.json",
  );
  await writeFile(
    variantPath,
    `${JSON.stringify({ variant: "spark" }, null, 2)}\n`,
    "utf8",
  );

  return Response.json({ ok: true });
}
