import { NextResponse } from "next/server";

const MODEL = "llama3.1:8b";

export async function POST(req: Request) {
  try {
    const { action, text, language } = await req.json();

    let prompt = "";
    switch (action) {
      case "summarize":
        prompt = `Eres un asistente experto en síntesis de textos. Tu tarea es resumir el texto proporcionado de manera concisa y clara.
          Instrucciones:
          1. El resumen debe capturar las ideas principales y los puntos clave.
          2. La longitud máxima debe ser de 3 oraciones.
          3. El tono debe ser objetivo e informativo.
          Texto a resumir:\n\n${text}`;
        break;
      case "improve":
        prompt = `Eres un editor de texto profesional con un ojo agudo para la claridad y el estilo. Tu tarea es revisar el texto proporcionado.
          Instrucciones:
          1. Corrige cualquier error gramatical, de puntuación u ortográfico.
          2. Mejora la fluidez, el estilo y la claridad de la prosa.
          3. Mantén el significado original del texto.
          4. Devuelve únicamente la versión revisada del texto, sin comentarios ni explicaciones.
          Texto a mejorar:\n\n${text}`;
        break;
      case "translate":
        prompt = `Eres un traductor experto. Tu tarea es traducir el siguiente texto al idioma seleccionado.
        Instrucciones:
        1. La traducción debe ser precisa y natural.
        2. Mantén el tono del texto original.
        3. Devuelve únicamente la traducción, sin añadir introducciones ni comentarios.
        Texto a traducir:\n\n${text}
        Traducir al idioma:\n\n${language}`;
        break;
      case "extract_keywords":
        prompt = `Tu tarea es analizar el siguiente texto y extraer las palabras clave o frases más relevantes que capten su tema principal.
        Instrucciones:
        1. Extrae entre 5 y 10 palabras o frases clave.
        2. Devuelve las palabras clave como una lista separada por comas (ejemplo: palabra1, palabra2, frase clave, etc.) Devuelve únicamente la las palabras clave, sin añadir introducciones ni comentarios.
        Texto a analizar:\n\n${text}`;
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
