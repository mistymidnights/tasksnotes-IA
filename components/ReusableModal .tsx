// components/ReusableModal.tsx

import React, { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ReusableModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  children: ReactNode;
  confirmText: string;
  confirmAction: () => void;
  confirmColor?: "primary" | "danger" | "success" | "warning";
}

export const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  children,
  confirmText,
  confirmAction,
  confirmColor = "primary",
}) => {
  const handleConfirm = () => {
    confirmAction();
    onOpenChange(false);
  };

  return (
    <Modal
      shadow="lg"
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-linear-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title} {/* Título dinámico */}
            </ModalHeader>

            <ModalBody>{children}</ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color={confirmColor} onPress={handleConfirm}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
