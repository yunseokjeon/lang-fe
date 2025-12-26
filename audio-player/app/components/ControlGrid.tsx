import { RefObject } from "react";
import { Volume2, Gauge, Repeat } from "lucide-react";

interface ControlGridProps {
  volumeValue: number;
  speedValue: number;
  volumeRef: RefObject<HTMLDivElement | null>;
  speedRef: RefObject<HTMLDivElement | null>;
  handleVolumeDrag: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleSpeedDrag: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ControlGrid({
  volumeValue,
  speedValue,
  volumeRef,
  speedRef,
  handleVolumeDrag,
  handleSpeedDrag,
}: ControlGridProps) {
  return (
    <div className="px-4" style={{ paddingBottom: "2rem" }}>
      <div
        className="grid grid-cols-5"
        style={{
          gridTemplateRows: "auto auto",
          columnGap: "0.625rem",
          rowGap: "1rem",
        }}
      >
        {/* Volume - spans 2 rows */}
        <div
          ref={volumeRef}
          onMouseDown={handleVolumeDrag}
          className="relative overflow-hidden text-white flex flex-col items-center justify-end pb-2 select-none cursor-ns-resize row-span-2"
          style={{
            background: `linear-gradient(to top, #14b8a6 ${volumeValue}%, #475569 ${volumeValue}%)`,
            gridRow: "1 / 3",
            borderRadius: "1rem",
          }}
        >
          <Volume2 size={18} className="z-10 mb-1" />
          <span className="text-xs font-semibold z-10">{volumeValue}</span>
        </div>

        {/* Speed - spans 2 rows */}
        <div
          ref={speedRef}
          onMouseDown={handleSpeedDrag}
          className="relative overflow-hidden text-white flex flex-col items-center justify-end pb-2 select-none cursor-ns-resize row-span-2"
          style={{
            background: `linear-gradient(to top, #14b8a6 ${
              ((speedValue - 0.5) / 2.5) * 100
            }%, #475569 ${((speedValue - 0.5) / 2.5) * 100}%)`,
            gridRow: "1 / 3",
            borderRadius: "1rem",
          }}
        >
          <Gauge size={18} className="z-10 mb-1" />
          <span className="text-xs font-semibold z-10">
            {speedValue.toFixed(1)}x
          </span>
        </div>

        {/* Row 1: Repeat x5, Repeat x10, Infinite */}
        <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex flex-col items-center justify-center transition">
          <Repeat size={18} />
          <span className="text-[10px] font-semibold -mt-0.5">x5</span>
        </button>
        <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex flex-col items-center justify-center transition">
          <Repeat size={18} />
          <span className="text-[10px] font-semibold -mt-0.5">x10</span>
        </button>
        <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex flex-col items-center justify-center transition">
          <span className="text-xl font-light leading-none">∞</span>
          <span className="text-[10px] font-semibold -mt-0.5">Inf</span>
        </button>

        {/* Row 2: ALL, A, B */}
        <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-sm font-bold">
          ALL
        </button>
        <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-sm font-bold">
          A
        </button>
        <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-sm font-bold">
          B
        </button>
      </div>
    </div>
  );
}
