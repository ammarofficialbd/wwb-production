import { Star } from "lucide-react";

type Props = {
  thumbnail: React.ReactNode;
  badge: string;
  title: string;
  meta: string;
  time: string;
  chapter?: string;
  rating: string;
};

export default function CourseCard({
  thumbnail,
  badge,
  title,
  meta,
  time,
  chapter,
  rating,
}: Props) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-3xl p-4">
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
        {thumbnail}
        <span className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-[15px] leading-snug">{title}</h4>
          <div className="flex items-center gap-1 text-sm font-semibold shrink-0">
            <Star size={14} className="fill-[var(--amber)] text-[var(--amber)]" />
            {rating}
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mt-1">{meta}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs font-medium text-[#5b5d76]">
            {time}
            {chapter && (
              <span className="ml-2 text-[var(--muted)]">{chapter}</span>
            )}
          </p>
          <button className="bg-[var(--amber)] hover:bg-[var(--amber-dark)] transition-colors text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Go To Detail
          </button>
        </div>
      </div>
    </div>
  );
}
