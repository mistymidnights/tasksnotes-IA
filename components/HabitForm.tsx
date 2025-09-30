"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";

export default function HabitForm() {
  const [habit, setHabit] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAI = async () => {
    const res = await fetch("/api/ai/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: habit }),
    });
    const data = await res.json();
    setSuggestions(data.suggestions.split("\n").filter(Boolean));
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <Input
        label="Nuevo hábito"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
      />
      <Button color="primary" onClick={handleAI}>
        Sugerir con IA
      </Button>

      {suggestions.length > 0 && (
        <ul className="list-disc pl-5">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
