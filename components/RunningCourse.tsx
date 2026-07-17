export default function RunningCourse() {
  const percent = 75;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="w-full lg:w-[220px] shrink-0 rounded-3xl p-6 bg-gradient-to-br from-[#8b8ef4] to-[#6a6df0] text-white flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-white/85">Running Course</p>
        <p className="text-5xl font-extrabold mt-1">75</p>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div className="relative w-[92px] h-[92px] shrink-0">
          <svg width="92" height="92" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="9"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--amber)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold leading-none">{percent}%</span>
          </div>
        </div>
        <div className="leading-tight">
          <p className="text-2xl font-extrabold">100</p>
          <p className="text-sm text-white/85">Course</p>
        </div>
      </div>
    </div>
  );
}
