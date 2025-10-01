export type AIAction = "summarize" | "improve" | "ideas";

export async function processWithAI(action: AIAction, text: string) {
  const res = await fetch("/api/ai/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, text }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error desconocido");
  return data.result;
}
