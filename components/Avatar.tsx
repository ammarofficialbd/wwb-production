const palette = [
  "bg-[#ffb020]",
  "bg-[#4f8ff0]",
  "bg-[#ff7a8a]",
  "bg-[#7c7ff2]",
  "bg-[#2fbf87]",
];

function hashName(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return sum;
}

import Image from "next/image";
import { AVATAR_URLS } from "@/lib/avatars";

export default function Avatar({ name, size = 32, avatarId }: { name: string; size?: number; avatarId?: number }) {
  const url = avatarId !== undefined && avatarId >= 0 && avatarId < AVATAR_URLS.length ? AVATAR_URLS[avatarId] : null;

  if (url) {
    return (
      <div 
        className="rounded-full overflow-hidden relative shrink-0" 
        style={{ width: size, height: size }}
      >
        <Image src={url} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = palette[hashName(name) % palette.length];

  return (
    <div
      className={`${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
