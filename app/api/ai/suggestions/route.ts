import { NextResponse } from "next/server";

const MODEL = "llama2";

export async function POST(req: Request) {
  try {
    const { action, text } = await req.json();

    let prompt = "";
    switch (action) {
      case "summarize":
        prompt = `Resume el siguiente texto en 2-3 oraciones:\n\n${text}`;
        break;
      case "improve":
        prompt = `Mejora la claridad, gramática y estilo del siguiente texto:\n\n${text}`;
        break;
      case "ideas":
        prompt = `Genera 3 ideas creativas basadas en este texto:\n\n${text}`;
        break;
      default:
        return NextResponse.json(
          { error: "Acción no válida" },
          { status: 400 }
        );
    }

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama error: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json({ result: data.response.trim() });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Error al procesar con IA" },
      { status: 500 }
    );
  }
}
