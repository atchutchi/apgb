import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { LocalContentRepository } from "./local-repository";
import type { CreateContentInput } from "./types";

const baseInput: CreateContentInput = {
  type: "news",
  slug: "noticia-teste",
  section: "autoridade-portuaria",
  status: "draft",
  title: "Notícia de teste",
  summary: "Resumo suficientemente completo para o conteúdo de teste.",
  body: "## Primeiro bloco\n\nConteúdo editorial de teste.",
  heroImage: "/media/gallery/dsc_3989.webp",
  heroAlt: "Edifício da APGB",
  featured: false,
  galleryUrls: [],
  documentUrls: [],
  translate: false,
};

describe("LocalContentRepository", () => {
  let file: string;
  let repository: LocalContentRepository;

  beforeEach(async () => {
    file = join(await mkdtemp(join(tmpdir(), "apgb-content-")), "content.json");
    repository = new LocalContentRepository(file);
  });

  it("cria e obtém conteúdo por id e slug", async () => {
    const created = await repository.create(baseInput);

    expect(await repository.getById(created.id)).toEqual(created);
    expect(await repository.getBySlug(created.slug)).toEqual(created);
  });

  it("actualiza conteúdo e guarda a versão anterior", async () => {
    const created = await repository.create(baseInput);
    const updated = await repository.update(created.id, {
      ...baseInput,
      status: "published",
      title: "Notícia publicada",
      featured: true,
    });

    expect(updated?.status).toBe("published");
    expect(updated?.publishedAt).not.toBeNull();
    expect(updated?.featured).toBe(true);
    expect(updated?.translations[0]?.title).toBe("Notícia publicada");

    const versions = JSON.parse(await readFile(`${file}.versions.json`, "utf8")) as Array<{
      contentId: string;
      snapshot: { status: string };
    }>;
    expect(versions).toHaveLength(1);
    expect(versions[0]).toMatchObject({ contentId: created.id, snapshot: { status: "draft" } });
  });

  it("arquiva e remove conteúdo logicamente", async () => {
    const created = await repository.create({ ...baseInput, status: "published" });

    const archived = await repository.archive(created.id);
    expect(archived?.status).toBe("archived");

    const removed = await repository.remove(created.id);
    expect(removed?.deletedAt).not.toBeNull();
    expect((await repository.list()).find((item) => item.id === created.id)).toBeUndefined();
    expect(await repository.getBySlug(created.slug)).toMatchObject({ id: created.id });
  });

  it("recusa slugs duplicados", async () => {
    await repository.create(baseInput);

    await expect(repository.create(baseInput)).rejects.toThrow("slug");
  });
});
