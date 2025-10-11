import { useNotes } from "@/hooks/useNotes";
import { Note, useNoteStore } from "@/stores/useNoteStore";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Form } from "@heroui/form";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { processWithAI } from "@/lib/ollamaClient";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { AiActionTooltip } from "../AI/AiActionTooltip";
import { AiActionDropdown } from "../AI/AiActionDropdown";
import { useNoteAI } from "@/hooks/useNoteAI";

interface NoteEditorProps {
  note: Note;
  onClose: () => void;
}
const NoteEditor = ({ note, onClose }: NoteEditorProps) => {
  const { saveNote } = useNoteStore();

  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const [loadingAI, setLoadingAI] = useState(false);
  const { selectedText, setSelectedText, clearSelection } = useSelectionStore();
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const { handleAIAction } = useNoteAI(setDescription);

  const handleSelection = (e: any) => {
    const textarea = e.target as HTMLTextAreaElement;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    const rect = textarea.getBoundingClientRect();
    const selection = window.getSelection();

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
    await saveNote({ ...note, title, description });
    onClose();
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

      <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
        <AiActionDropdown
          onAction={(action, lang) =>
            handleAIAction(action as any, description, lang)
          }
          loading={loadingAI}
        />
        <Button type="submit" variant="solid" color="primary">
          Guardar
        </Button>
        <Button type="button" variant="flat" color="danger" onPress={onClose}>
          Cancelar
        </Button>
      </div>
    </Form>
  );
};

export default NoteEditor;
