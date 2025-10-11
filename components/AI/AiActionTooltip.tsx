import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { LANGUAGES } from "@/config/languages";

interface Props {
  x: number;
  y: number;
  onAction: (action: string, lang?: string) => void;
}

export const AiActionTooltip = ({ x, y, onAction }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y + 180,
        left: x,
        zIndex: 50,
      }}
    >
      <Tooltip
        color="default"
        placement="top"
        isOpen
        content={
          <div className="flex gap-2">
            <Button
              size="sm"
              color="primary"
              onPress={() => onAction("summarize")}
            >
              Resumir 📝
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="success"
              onPress={() => onAction("improve")}
            >
              Mejorar 🪄
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" color="warning" variant="flat">
                  Traducir 🌐
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => onAction("translate", key.toString())}
              >
                {LANGUAGES.map((lang) => (
                  <DropdownItem key={lang.key}>{lang.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => onAction("extract_keywords")}
            >
              Palabras clave 🗝️
            </Button>
          </div>
        }
      >
        <span></span>
      </Tooltip>
    </div>
  );
};
