import { writeFile } from "node:fs/promises";
import path from "node:path";

type Body = { variant?: string };

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Dev only" }, { status: 403 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const variant = body.variant === "spark" ? "spark" : "aurora";
  const filePath = path.join(
    process.cwd(),
    "src/content/secondary-background.json",
  );
  await writeFile(
    filePath,
    `${JSON.stringify({ variant }, null, 2)}\n`,
    "utf8",
  );

  return Response.json({ ok: true, variant });
}
