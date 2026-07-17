import { Star } from "lucide-react";
import Avatar from "./Avatar";

type Props = {
  title: string;
  person: string;
  time: string;
  meta: string;
  rating?: string;
  emphasized?: boolean;
};

export default function ScheduleCard({
  title,
  person,
  time,
  meta,
  rating,
  emphasized,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4
          className={`text-sm leading-snug ${
            emphasized ? "font-bold" : "font-semibold"
          }`}
        >
          {title}
        </h4>
        {rating && (
          <div className="flex items-center gap-1 text-sm font-semibold shrink-0">
            <Star size={14} className="fill-[var(--amber)] text-[var(--amber)]" />
            {rating}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Avatar name={person} size={24} />
        <span className="text-xs text-[var(--muted)]">{person}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{time}</span>
        <span className="text-xs text-[var(--muted)]">{meta}</span>
      </div>
    </div>
  );
}
