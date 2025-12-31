import { RefObject, useRef } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);

  // duration이 0일 때 기본값 사용 (UI 표시용)
  const displayDuration = duration || 100;
  const hasFile = duration > 0;

  // 마커 위치 계산 (파일이 없을 때: A=0%, B=100%)
  const markerAPercent = hasFile ? (markerA / displayDuration) * 100 : 0;
  const markerBPercent = hasFile ? (markerB / displayDuration) * 100 : 100;

  // 프로그레스 퍼센트 계산 (전체 duration 기준)
  const progressPercent = hasFile ? (currentTime / displayDuration) * 100 : 0;

  // 슬라이더 드래그 핸들러
  const handleSliderInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFile || !trackRef.current) return;

    const updatePosition = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newTime = (x / rect.width) * displayDuration;
      onSeek(newTime);
    };

    updatePosition(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updatePosition(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

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

          {/* Custom Progress Bar Container */}
          <div
            ref={trackRef}
            className={`relative mt-8 z-10 ${hasFile ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{ height: "20px", display: "flex", alignItems: "center" }}
            onMouseDown={handleSliderInteraction}
          >
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "4px",
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${progressPercent}%, #0d9488 ${progressPercent}%, #0d9488 100%)`,
              }}
            />
            {/* Thumb */}
            <div
              style={{
                position: "absolute",
                width: "20px",
                height: "20px",
                backgroundColor: "white",
                borderRadius: "50%",
                left: `${progressPercent}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                zIndex: 20,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
