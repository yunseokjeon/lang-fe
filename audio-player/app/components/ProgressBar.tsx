import { RefObject } from "react";
import { formatShortTime } from "../utils/time";

interface ProgressBarProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  markerA: number;
  markerB: number;
  isDraggingA: boolean;
  isDraggingB: boolean;
  progressRef: RefObject<HTMLDivElement | null>;
  handleMarkerDrag: (
    e: React.MouseEvent<HTMLDivElement>,
    marker: "A" | "B"
  ) => void;
}

export default function ProgressBar({
  currentTime,
  setCurrentTime,
  duration,
  markerA,
  markerB,
  isDraggingA,
  isDraggingB,
  progressRef,
  handleMarkerDrag,
}: ProgressBarProps) {
  return (
    <div className="px-6" style={{ paddingBottom: "2.5rem" }}>
      <div className="relative pb-6">
        <div className="relative" ref={progressRef}>
          {/* A Marker */}
          <div
            className={`absolute z-30 select-none ${
              isDraggingA ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              left: `${(markerA / duration) * 100}%`,
              top: "-2px",
              transform: "translateX(-50%)",
            }}
            onMouseDown={(e) => handleMarkerDrag(e, "A")}
          >
            <div className="flex flex-col items-center">
              <div className="text-xs text-white font-medium mb-1">
                {formatShortTime(markerA)}
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-teal-400"></div>
              <div className="text-[11px] text-teal-400 font-bold -mt-0.5">
                A
              </div>
            </div>
          </div>

          {/* B Marker */}
          <div
            className={`absolute z-30 select-none ${
              isDraggingB ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              left: `${(markerB / duration) * 100}%`,
              top: "-2px",
              transform: "translateX(-50%)",
            }}
            onMouseDown={(e) => handleMarkerDrag(e, "B")}
          >
            <div className="flex flex-col items-center">
              <div className="text-xs text-white font-medium mb-1">
                {formatShortTime(markerB)}
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-teal-400"></div>
              <div className="text-[11px] text-teal-400 font-bold -mt-0.5">
                B
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full h-2 bg-teal-600 rounded-lg appearance-none cursor-pointer slider relative z-10 mt-8"
            style={{
              background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${
                (currentTime / duration) * 100
              }%, #0d9488 ${(currentTime / duration) * 100}%, #0d9488 100%)`,
            }}
          />
        </div>

        {/* Time Labels Below Progress Bar */}
        <div className="flex justify-between text-[11px] text-white/80 mt-2 px-0.5">
          <span>{formatShortTime(currentTime)}</span>
          <span>-{formatShortTime(duration - currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
