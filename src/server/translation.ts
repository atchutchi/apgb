export type TranslationResult = {
  text: string;
  status: "translated" | "source-fallback";
};

export async function translateText(
  text: string,
  target: "FR" | "EN",
): Promise<TranslationResult> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return { text, status: "source-fallback" };

  const endpoint = process.env.DEEPL_API_URL || "https://api-free.deepl.com/v2/translate";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: "PT",
        target_lang: target,
      }),
    });
    if (!response.ok) return { text, status: "source-fallback" };
    const data = (await response.json()) as { translations?: Array<{ text: string }> };
    return {
      text: data.translations?.[0]?.text || text,
      status: data.translations?.[0]?.text ? "translated" : "source-fallback",
    };
  } catch {
    return { text, status: "source-fallback" };
  }
}
