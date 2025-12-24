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
  const progressRef = useRef<HTMLDivElement>(null);

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
    sliderType: "speed" | "custom"
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startValue = sliderType === "speed" ? speedValue : customValue;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const sensitivity = sliderType === "speed" ? 0.01 : 0.5;
      const newValue = startValue + deltaX * sensitivity;

      if (sliderType === "speed") {
        setSpeedValue(Math.max(0.5, Math.min(3.0, newValue)));
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
