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

export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
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
