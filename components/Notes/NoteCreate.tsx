import { useNoteStore } from "@/stores/useNoteStore";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { Form } from "@heroui/form";
import { useAuth } from "@/hooks/useAuth";
import { useNoteAI } from "@/hooks/useNoteAI";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { AiActionTooltip } from "../AI/AiActionTooltip";
import { AiActionDropdown } from "../AI/AiActionDropdown";

interface NoteCreateProps {
  onClose: () => void;
}
const NoteCreate = ({ onClose }: NoteCreateProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);
  const { selectedText, setSelectedText, clearSelection } = useSelectionStore();
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const { handleAIAction } = useNoteAI(setDescription);

  const createNote = useNoteStore((state) => state.createNote);
  const { user } = useAuth();

  const handleSelection = (e: any) => {
    const textarea = e.target as HTMLTextAreaElement;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    const rect = textarea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selected.trim()) {
      setSelectedText(selected.trim());
      setTooltipPos({ x, y });
    } else {
      clearSelection();
      setTooltipPos(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast({
        title: "Error",
        description: "Debes iniciar sesión.",
        color: "danger",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      addToast({
        title: "Error",
        description: "Ambos campos son requeridos.",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      const newNoteData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
      };

      await createNote(newNoteData);

      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Fallo al crear la nota. Intenta de nuevo.",
        color: "danger",
      });
      console.error("Fallo la creación de nota:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      data-theme="light"
      className="w-full text-black py-8"
      onSubmit={handleSubmit}
    >
      <Input
        value={title}
        label="Titulo de la nota"
        labelPlacement="inside"
        name="Titulo de la nota"
        type="text"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        value={description}
        label="Descripcion"
        labelPlacement="inside"
        onChange={(e) => setDescription(e.target.value)}
        onMouseUp={handleSelection}
      />

      {selectedText && tooltipPos && (
        <AiActionTooltip
          x={tooltipPos.x}
          y={tooltipPos.y}
          onAction={(action, lang) =>
            handleAIAction(action as any, selectedText, lang)
          }
        />
      )}

      <div className="flex items-center gap-2 mt-2">
        <AiActionDropdown
          onAction={(action, lang) =>
            handleAIAction(action as any, description, lang)
          }
          loading={loadingAI}
        />

        <Button
          type="submit"
          variant="solid"
          color="primary"
          isLoading={loading || loadingAI}
          disabled={loading || loadingAI}
        >
          Crear Nota
        </Button>
        <Button
          type="button"
          onPress={onClose}
          variant="flat"
          color="danger"
          disabled={loading || loadingAI}
        >
          Cancelar
        </Button>
      </div>
    </Form>
  );
};

export default NoteCreate;
