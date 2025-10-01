import { Card, CardBody, Chip } from "@heroui/react";
import React from "react";

interface NoteCardProps {
  title: string;
  children: string;
  date: string;
  isCentered?: boolean;
  maxTextLength: number;
}

export default function NoteCard({
  title,
  children,
  date,
  isCentered,
  maxTextLength,
}: NoteCardProps) {
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    // Corta el texto al límite y añade los puntos suspensivos
    return text.substring(0, maxLength) + "...";
  };

  const alignmentClass = isCentered ? "text-center" : "text-left";
  const truncatedContent = truncateText(children, maxTextLength);

  return (
    <Card className={alignmentClass} classNames={{ base: "bg-[#2f0f44]" }}>
      <CardBody>
        <p className="text-xl font-bold mb-2">{title}</p>
        <p className="text-sm">{truncatedContent}</p>
        <div className="text-right">
          <Chip
            size="sm"
            color="secondary"
            variant="flat"
            className="mt-4 lg:mt-2"
          >
            {date}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}
