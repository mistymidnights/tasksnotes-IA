export type AIAction =
  | "summarize"
  | "improve"
  | "translate"
  | "extract_keywords";

export async function processWithAI(
  action: AIAction,
  text: string,
  language?: string
) {
  const res = await fetch("/api/ai/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, text, language }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error desconocido");
  return data.result;
}
