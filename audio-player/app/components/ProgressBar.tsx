import { RefObject } from "react";
import { formatShortTime } from "../utils/time";

interface ProgressBarProps {
  currentTime: number;
  onSeek: (time: number) => void;
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
  onSeek,
  duration,
  markerA,
  markerB,
  isDraggingA,
  isDraggingB,
  progressRef,
  handleMarkerDrag,
}: ProgressBarProps) {
  // duration이 0일 때 기본값 사용 (UI 표시용)
  const displayDuration = duration || 100;
  const hasFile = duration > 0;

  // 마커 위치 계산 (파일이 없을 때: A=0%, B=100%)
  const markerAPercent = hasFile ? (markerA / displayDuration) * 100 : 0;
  const markerBPercent = hasFile ? (markerB / displayDuration) * 100 : 100;

  // 프로그레스 퍼센트 계산
  const progressPercent = hasFile ? (currentTime / displayDuration) * 100 : 0;

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
              left: `${markerAPercent}%`,
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
              left: `${markerBPercent}%`,
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
            max={displayDuration}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            disabled={!hasFile}
            className={`w-full h-2 bg-teal-600 rounded-lg appearance-none slider relative z-10 mt-8 ${hasFile ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{
              background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${progressPercent}%, #0d9488 ${progressPercent}%, #0d9488 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
