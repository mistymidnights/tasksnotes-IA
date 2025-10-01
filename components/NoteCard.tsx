import { useNoteStore } from "@/stores/useNoteStore";
import {
  addToast,
  Button,
  Card,
  CardBody,
  Chip,
  useDisclosure,
} from "@heroui/react";
import { todo } from "node:test";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { ReusableModal } from "./ReusableModal ";

interface NoteCardProps {
  id: string;
  title: string;
  children: string;
  date: string;
  isCentered?: boolean;
  maxTextLength: number;
  onSelect?: () => void;
}

export default function NoteCard({
  id,
  title,
  children,
  date,
  isCentered,
  maxTextLength,
  onSelect,
}: NoteCardProps) {
  const { deleteNote } = useNoteStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);

  const alignmentClass = isCentered ? "text-center" : "text-left";
  /*   ------------ LIMITE DE TEXTO ------------ */
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    // Corta el texto al límite y añade los puntos suspensivos
    return text.substring(0, maxLength) + "...";
  };

  const truncatedContent = truncateText(children, maxTextLength);

  /*   ------------ DELETE ------------ */

  const openDeleteModal = (noteId: string) => {
    setNoteToDeleteId(noteId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (noteToDeleteId) {
      try {
        await deleteNote(noteToDeleteId);
        setNoteToDeleteId(null);
      } catch (error) {
        console.error("Fallo la confirmación de eliminación:", error);
      }
    }
  };

  return (
    <>
      <Card
        className={alignmentClass}
        classNames={{ base: "bg-[#2f0f44]" }}
        onPress={onSelect}
      >
        <CardBody>
          <p className="text-xl font-bold mb-2">{title}</p>
          <p className="text-sm">{truncatedContent}</p>
          <div className="flex justify-between items-center mt-4">
            <Chip
              size="sm"
              color="secondary"
              variant="flat"
              className="mt-4 lg:mt-2"
            >
              {date}
            </Chip>
            <Button
              isIconOnly
              color="danger"
              variant="flat"
              title="Borrar nota"
              size="sm"
              onPress={() => openDeleteModal(id)}
            >
              <MdDelete size={20} />
            </Button>
          </div>
        </CardBody>
      </Card>
      <ReusableModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Confirmar Eliminación"
        confirmText="Borrar"
        confirmAction={confirmDelete}
        confirmColor="danger"
      >
        <p>
          ¿Estás seguro de que quieres eliminar esta nota? Esta acción no se
          puede deshacer.
        </p>
      </ReusableModal>
    </>
  );
}
