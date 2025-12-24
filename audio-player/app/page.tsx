"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  ChevronLeft,
  ChevronRight,
  Share2,
  Menu,
  Repeat,
  Infinity,
  Volume2,
  RotateCw,
  BookOpen,
  Eye,
} from "lucide-react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(5722); // 01:35:22 in seconds
  const [duration, setDuration] = useState(6502); // Total duration in seconds
  const [markerA, setMarkerA] = useState(742); // 12:22 in seconds
  const [markerB, setMarkerB] = useState(2092); // 34:52 in seconds
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);
  const [speedValue, setSpeedValue] = useState(1.2); // Speed multiplier
  const [customValue, setCustomValue] = useState(75); // Custom value (0-100)
  const [volumeValue, setVolumeValue] = useState(80); // Volume (0-100)
  const progressRef = useRef<HTMLDivElement>(null);

  // Resizable grid 상태
  const [horizontalSplit, setHorizontalSplit] = useState(50);
  const [verticalSplit, setVerticalSplit] = useState(50);
  const [regionMarkers] = useState([
    { id: 1, position: 1000 },
    { id: 2, position: 2000 },
    { id: 3, position: 3000 },
    { id: 4, position: 4000 },
  ]);
  const gridRef = useRef<HTMLDivElement>(null);

  // 볼륨 컨트롤 세로 분할
  const [volumeSplit, setVolumeSplit] = useState(50);
  const volumeRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatShortTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMarkerDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    marker: "A" | "B"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!progressRef.current) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
      const newTime = Math.round((x / rect.width) * duration);

      if (marker === "A") {
        setMarkerA(Math.min(newTime, markerB - 1));
      } else {
        setMarkerB(Math.max(newTime, markerA + 1));
      }
    };

    const handleMouseUp = () => {
      if (marker === "A") setIsDraggingA(false);
      else setIsDraggingB(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    if (marker === "A") setIsDraggingA(true);
    else setIsDraggingB(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSliderDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    sliderType: "speed" | "custom" | "volume"
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startValue =
      sliderType === "speed" ? speedValue :
      sliderType === "volume" ? volumeValue :
      customValue;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const sensitivity = sliderType === "speed" ? 0.01 : 0.5;
      const newValue = startValue + deltaX * sensitivity;

      if (sliderType === "speed") {
        setSpeedValue(Math.max(0.5, Math.min(3.0, newValue)));
      } else if (sliderType === "volume") {
        setVolumeValue(Math.max(0, Math.min(100, Math.round(newValue))));
      } else {
        setCustomValue(Math.max(0, Math.min(100, Math.round(newValue))));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gridRef.current) return;

    const startX = e.clientX;
    const startSplit = verticalSplit;
    const rect = gridRef.current.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / rect.width) * 100;
      const newSplit = Math.max(20, Math.min(80, startSplit + deltaPercent));
      setVerticalSplit(newSplit);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleHorizontalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gridRef.current) return;

    const startY = e.clientY;
    const startSplit = horizontalSplit;
    const rect = gridRef.current.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaPercent = (deltaY / rect.height) * 100;
      const newSplit = Math.max(20, Math.min(80, startSplit + deltaPercent));
      setHorizontalSplit(newSplit);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const jumpToMarker = (position: number) => {
    setCurrentTime(position);
  };

  const handleVolumeSplitDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const container = volumeRef.current;
    if (!container) return;

    const updateSplit = (clientY: number) => {
      const rect = container.getBoundingClientRect();
      const y = clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setVolumeSplit(percentage);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updateSplit(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    updateSplit(e.clientY);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-600 to-slate-500 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-gradient-to-b from-blue-900 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white">
          <button className="p-2 hover:bg-white/10 rounded-lg transition">
            <Share2 size={20} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition">
            <Menu size={24} />
          </button>
        </div>

        {/* Title and Time Display */}
        <div className="text-center text-white px-6 pb-4">
          <h1 className="text-base font-normal mb-3 opacity-90">
            Hackers TOEFL Chapter 1
          </h1>
          <div className="text-6xl font-extralight tracking-wider">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="px-6 pb-6">
          <div className="relative pb-6">
            {/* Progress Bar Container */}
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
                  <div className="text-[11px] text-teal-400 font-bold -mt-0.5">A</div>
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
                  <div className="text-[11px] text-teal-400 font-bold -mt-0.5">B</div>
                </div>
              </div>

              {/* Current Time Display Above Progress Bar */}
              <div
                className="absolute z-20 text-xs text-white font-medium pointer-events-none"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                  top: "-2px",
                  transform: "translateX(-50%)",
                }}
              >
                {formatShortTime(currentTime)}
              </div>

              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-2 bg-teal-600 rounded-lg appearance-none cursor-pointer slider relative z-10"
                style={{
                  background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${
                    (currentTime / duration) * 100
                  }%, #0d9488 ${(currentTime / duration) * 100}%, #0d9488 100%)`,
                }}
              />
            </div>

            {/* Time Labels Below Progress Bar */}
            <div className="flex justify-between text-[11px] text-white/80 mt-2 px-0.5">
              <span>{formatShortTime(markerA)}</span>
              <span>-{formatShortTime(duration - currentTime)}</span>
            </div>
          </div>
        </div>

        {/* Main Control Buttons */}
        <div className="grid grid-cols-5 gap-2.5 px-4 pb-3">
          <button className="bg-teal-700 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <ChevronLeft size={24} />
          </button>
          <button className="bg-teal-600 hover:bg-teal-500 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <Rewind size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-teal-500 hover:bg-teal-400 text-white p-3.5 rounded-xl flex items-center justify-center transition"
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
          </button>
          <button className="bg-teal-600 hover:bg-teal-500 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <FastForward size={24} />
          </button>
          <button className="bg-teal-700 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Speed and Repeat Controls */}
        <div className="grid grid-cols-5 gap-2.5 px-4 pb-3">
          <div
            onMouseDown={(e) => handleSliderDrag(e, "custom")}
            className="bg-slate-300 hover:bg-slate-200 text-gray-700 p-3 rounded-xl text-sm font-bold transition cursor-ew-resize flex items-center justify-center select-none"
          >
            {customValue}
          </div>
          <div
            onMouseDown={(e) => handleSliderDrag(e, "speed")}
            className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-xl text-sm font-bold transition cursor-ew-resize flex items-center justify-center select-none"
          >
            {speedValue.toFixed(1)}x
          </div>
          <button className="bg-blue-800/80 hover:bg-blue-800 text-white p-2.5 rounded-xl flex flex-col items-center justify-center transition">
            <RotateCw size={16} />
            <span className="text-[10px] mt-0.5 font-semibold">x5</span>
          </button>
          <button className="bg-blue-800/80 hover:bg-blue-800 text-white p-2.5 rounded-xl flex flex-col items-center justify-center transition">
            <RotateCw size={16} />
            <span className="text-[10px] mt-0.5 font-semibold">x10</span>
          </button>
          <button className="bg-blue-800/80 hover:bg-blue-800 text-white p-3 rounded-xl flex items-center justify-center transition">
            <Infinity size={22} />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="grid grid-cols-3 gap-2.5 px-4 pb-3">
          <button className="bg-blue-800/80 hover:bg-blue-800 text-white p-3 rounded-xl flex items-center justify-center transition">
            <Volume2 size={20} />
          </button>
          <button className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-xl flex items-center justify-center transition">
            <RotateCw size={20} />
          </button>
          <button className="bg-blue-800/80 hover:bg-blue-800 text-white p-3 rounded-xl text-sm font-bold transition">
            ALL
          </button>
        </div>

        {/* 5번 이미지 스타일 컨트롤 */}
        <div className="px-4 pb-3 flex flex-col items-center gap-2">
          <div
            ref={volumeRef}
            style={{
              position: "relative",
              width: "80px",
              height: "120px",
              border: "2px solid #333",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "row-resize",
              userSelect: "none",
              backgroundColor: "#1d4ed8"
            }}
            onMouseDown={handleVolumeSplitDrag}
          >
            {/* 위쪽 영역 - 흰색 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: `${(volumeSplit / 100) * 120}px`,
                backgroundColor: "#ffffff",
                pointerEvents: "none",
              }}
            >
              <div style={{ fontSize: "10px", textAlign: "center", paddingTop: "8px", color: "#666" }}>
                {volumeSplit.toFixed(0)}%
              </div>
            </div>

            {/* 가로 구분선 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(volumeSplit / 100) * 120}px`,
                transform: "translateY(-50%)",
                height: "3px",
                backgroundColor: "#dc2626",
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
            </div>
          </div>
          <div className="text-white text-xs font-bold">
            Split: {volumeSplit.toFixed(0)}% | Height: {((volumeSplit / 100) * 120).toFixed(1)}px
          </div>
        </div>

        {/* Resizable 2x2 Grid */}
        <div className="px-4 pb-3">
          <div
            ref={gridRef}
            className="relative w-full h-24 mx-auto"
            style={{ userSelect: "none" }}
          >
            {/* 왼쪽 위 - 책 아이콘 */}
            <div
              className="absolute bg-slate-200 hover:bg-slate-100 text-slate-600 rounded-tl-lg flex flex-col items-center justify-center cursor-pointer transition"
              style={{
                left: 0,
                top: 0,
                width: `${verticalSplit}%`,
                height: `${horizontalSplit}%`,
              }}
              onClick={() => jumpToMarker(regionMarkers[0].position)}
            >
              <BookOpen size={20} />
            </div>

            {/* 오른쪽 위 - 비어있음 */}
            <div
              className="absolute bg-slate-200 hover:bg-slate-100 text-slate-600 rounded-tr-lg flex flex-col items-center justify-center cursor-pointer transition"
              style={{
                left: `${verticalSplit}%`,
                top: 0,
                width: `${100 - verticalSplit}%`,
                height: `${horizontalSplit}%`,
              }}
              onClick={() => jumpToMarker(regionMarkers[1].position)}
            >
            </div>

            {/* 왼쪽 아래 - 왼쪽 화살표 */}
            <div
              className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-bl-lg flex flex-col items-center justify-center cursor-pointer transition"
              style={{
                left: 0,
                top: `${horizontalSplit}%`,
                width: `${verticalSplit}%`,
                height: `${100 - horizontalSplit}%`,
              }}
              onClick={() => jumpToMarker(regionMarkers[2].position)}
            >
              <SkipBack size={20} />
            </div>

            {/* 오른쪽 아래 - 눈 아이콘 */}
            <div
              className="absolute bg-teal-500 hover:bg-teal-400 text-white rounded-br-lg flex flex-col items-center justify-center cursor-pointer transition"
              style={{
                left: `${verticalSplit}%`,
                top: `${horizontalSplit}%`,
                width: `${100 - verticalSplit}%`,
                height: `${100 - horizontalSplit}%`,
              }}
              onClick={() => jumpToMarker(regionMarkers[3].position)}
            >
              <Eye size={20} />
            </div>

            {/* 세로 구분선 */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-blue-900/50 cursor-col-resize z-10 hover:bg-blue-400 transition"
              style={{
                left: `${verticalSplit}%`,
                transform: "translateX(-50%)",
              }}
              onMouseDown={handleVerticalDrag}
            />

            {/* 가로 구분선 */}
            <div
              className="absolute left-0 right-0 h-1 bg-blue-900/50 cursor-row-resize z-10 hover:bg-blue-400 transition"
              style={{
                top: `${horizontalSplit}%`,
                transform: "translateY(-50%)",
              }}
              onMouseDown={handleHorizontalDrag}
            />
          </div>
        </div>

        {/* Number Buttons */}
        <div className="grid grid-cols-5 gap-2.5 px-4 pb-5">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className="bg-teal-700 hover:bg-teal-600 text-white p-3.5 rounded-xl text-lg font-bold transition"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Bottom Display Area */}
        <div className="bg-slate-300 px-4 pt-4 pb-6">
          <div className="bg-teal-500 rounded-2xl h-36 w-full"></div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
