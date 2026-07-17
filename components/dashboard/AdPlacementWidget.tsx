export default function AdPlacementWidget() {
  return (
    <div className="bg-gray-100 rounded-2xl p-5 shadow-inner border border-gray-200 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden group">
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 text-[10px] text-gray-500 rounded uppercase font-bold tracking-wider">
        Advertisement
      </div>
      <div className="text-center p-4">
        <h3 className="text-gray-400 font-bold mb-2">Space Available</h3>
        <p className="text-sm text-gray-500 mb-4 max-w-[200px]">
          Target global logistics, shipping lines, and custom clearing agencies.
        </p>
        <button className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
          Become a Sponsor
        </button>
      </div>
    </div>
  );
}
