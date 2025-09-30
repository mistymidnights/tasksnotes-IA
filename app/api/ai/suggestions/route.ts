import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: `Sugiere 3 hábitos diarios para mejorar: ${text}`,
    }),
  });

  const data = await res.json();

  return NextResponse.json({ suggestions: data.response });
}
