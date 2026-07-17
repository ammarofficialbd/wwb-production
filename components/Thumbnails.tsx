import { PenTool, LineChart, MonitorSmartphone } from "lucide-react";

export function ThumbYellow() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#ffd166] to-[#ffb020] flex items-center justify-center">
      <PenTool size={34} className="text-white/90" strokeWidth={2} />
    </div>
  );
}

export function ThumbBlue() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#8ec8f6] to-[#4f8ff0] flex items-center justify-center">
      <LineChart size={34} className="text-white/90" strokeWidth={2} />
    </div>
  );
}

export function ThumbPink() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#ffb3c7] to-[#ff8aa8] flex items-center justify-center">
      <MonitorSmartphone size={34} className="text-white/90" strokeWidth={2} />
    </div>
  );
}
