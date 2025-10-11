import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { LANGUAGES } from "@/config/languages";
import { useState } from "react";

interface Props {
  onAction: (action: string, lang?: string) => void;
  loading: boolean;
}

export const AiActionDropdown = ({ onAction, loading }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button variant="shadow" color="success" isLoading={loading}>
          ✨ Acciones IA
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Acciones IA">
        <DropdownItem key="summarize" onPress={() => onAction("summarize")}>
          Resumir 📝
        </DropdownItem>
        <DropdownItem key="improve" onPress={() => onAction("improve")}>
          Mejorar 🪄
        </DropdownItem>
        <DropdownItem
          key="translate"
          textValue="translate"
          isReadOnly
          endContent={
            <select
              className="outline-none w-28 py-1 px-2 rounded-md text-tiny border border-default-300 bg-neutral-900 text-sans"
              onChange={(e) => {
                if (!e.target.value) return;
                onAction("translate", e.target.value);
                setIsOpen(false);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Idioma
              </option>
              {LANGUAGES.map((lang) => (
                <option key={lang.key} value={lang.key}>
                  {lang.label}
                </option>
              ))}
            </select>
          }
        >
          Traducir 🌐
        </DropdownItem>
        <DropdownItem
          key="extract_keywords"
          onPress={() => onAction("extract_keywords")}
        >
          Palabras clave 🗝️
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
