import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { LocalMediaRepository } from "./local-repository";

describe("LocalMediaRepository", () => {
  let repository: LocalMediaRepository;

  beforeEach(async () => {
    const directory = await mkdtemp(join(tmpdir(), "apgb-media-"));
    repository = new LocalMediaRepository(join(directory, "media.json"));
  });

  it("regista e lista ficheiros por data", async () => {
    const first = await repository.create({
      title: "Fotografia do porto",
      altText: "Cais do Porto de Bissau",
      url: "/uploads/porto.webp",
      path: "porto.webp",
      contentType: "image/webp",
      size: 1024,
    });
    const second = await repository.create({
      title: "Regulamento",
      altText: "",
      url: "/uploads/regulamento.pdf",
      path: "regulamento.pdf",
      contentType: "application/pdf",
      size: 2048,
    });

    expect(await repository.list()).toEqual([second, first]);
  });

  it("actualiza metadados e remove o registo", async () => {
    const created = await repository.create({
      title: "Sem título",
      altText: "",
      url: "/uploads/porto.webp",
      path: "porto.webp",
      contentType: "image/webp",
      size: 1024,
    });

    expect(await repository.update(created.id, { title: "Porto", altText: "Vista do porto" }))
      .toMatchObject({ title: "Porto", altText: "Vista do porto" });
    expect(await repository.remove(created.id)).toBe(true);
    expect(await repository.list()).toEqual([]);
  });
});
