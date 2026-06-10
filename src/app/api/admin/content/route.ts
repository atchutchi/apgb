import { NextResponse } from "next/server";
import { z } from "zod";

import { hasAdminSession } from "@/server/auth";
import { getContentRepository } from "@/server/content/repository";

const schema = z.object({
  type: z.enum(["page", "news", "project", "document", "gallery", "notice"]),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published", "archived"]),
  title: z.string().min(3).max(180),
  summary: z.string().min(10).max(500),
  body: z.string().min(10),
  translate: z.boolean().default(true),
});

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  return NextResponse.json({ items: await getContentRepository().list() });
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Conteúdo inválido.", details: parsed.error.flatten() }, { status: 400 });
  }
  const item = await getContentRepository().create(parsed.data);
  return NextResponse.json({ item }, { status: 201 });
}
