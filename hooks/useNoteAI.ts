import { addToast } from "@heroui/react";
import { processWithAI } from "@/lib/ollamaClient";
import { useSelectionStore } from "@/stores/useSelectionStore";

export const useNoteAI = (
  setDescription: React.Dispatch<React.SetStateAction<string>>
) => {
  const { selectedText, clearSelection } = useSelectionStore();

  const handleAIAction = async (
    action: "summarize" | "improve" | "translate" | "extract_keywords",
    text: string,
    language?: string
  ) => {
    if (!text.trim()) {
      addToast({
        title: "Sin texto",
        description: "Selecciona texto o escribe algo primero.",
        color: "warning",
      });
      return;
    }

    try {
      const result = await processWithAI(action, text, language);
      if (selectedText) {
        setDescription((prev) => prev.replace(selectedText, result));
        clearSelection();
      } else {
        setDescription(result);
      }

      addToast({
        title: "IA completado",
        description: "Texto procesado correctamente.",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error IA",
        description: (error as Error).message,
        color: "danger",
      });
    }
  };

  return { handleAIAction };
};
