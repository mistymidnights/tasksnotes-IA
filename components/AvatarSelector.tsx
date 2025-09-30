"use client";

import React from "react";
import Image from "next/image";
import { AVATAR_OPTIONS } from "@/utils/avatarOptions";

interface AvatarSelectorProps {
  currentAvatarUrl: string | null;
  onSelectAvatar: (url: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatarUrl,
  onSelectAvatar,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">Elige tu Avatar</h3>
      <div className="flex flex-wrap gap-4 p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
        {AVATAR_OPTIONS.map((url) => (
          <div
            key={url}
            onClick={() => onSelectAvatar(url)}
            className={`
              w-16 h-16 rounded-full overflow-hidden cursor-pointer p-0.5 transition duration-200
              ${
                currentAvatarUrl === url
                  ? "ring-4 ring-offset-2 ring-blue-500"
                  : "hover:ring-2 hover:ring-gray-400"
              }
            `}
          >
            <Image
              src={url}
              alt={`Avatar option ${url.split("/").pop()}`}
              width={64}
              height={64}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
