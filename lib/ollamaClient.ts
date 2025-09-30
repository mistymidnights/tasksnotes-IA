export async function getHabitSuggestions(prompt: string) {
  const res = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: prompt }),
  });

  const data = await res.json();
  return data.suggestions;
}
