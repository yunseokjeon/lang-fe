"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  ChevronLeft,
  ChevronRight,
  Share2,
  Menu,
  Repeat,
  Volume2,
  Gauge,
} from "lucide-react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1826); // 30:26 in seconds
  const [duration, setDuration] = useState(2506); // Total duration (~41:46)
  const [markerA, setMarkerA] = useState(742); // 12:22 in seconds
  const [markerB, setMarkerB] = useState(1492); // 24:52 in seconds
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);
  const [speedValue, setSpeedValue] = useState(1.2);
  const [volumeValue, setVolumeValue] = useState(71);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);

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

  const handleVolumeDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = volumeRef.current;
    if (!container) return;

    const updateVolume = (clientY: number) => {
      const rect = container.getBoundingClientRect();
      const y = clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
      setVolumeValue(Math.round(percentage));
    };

    updateVolume(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updateVolume(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSpeedDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = speedRef.current;
    if (!container) return;

    const updateSpeed = (clientY: number) => {
      const rect = container.getBoundingClientRect();
      const y = clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
      // 0% = 0.5x, 100% = 3.0x
      const newSpeed = 0.5 + (percentage / 100) * 2.5;
      setSpeedValue(Math.round(newSpeed * 10) / 10);
    };

    updateSpeed(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updateSpeed(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-500 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-gradient-to-b from-sky-500 to-sky-600 rounded-3xl shadow-2xl overflow-hidden">
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
        <div className="text-center text-white px-6" style={{ paddingBottom: '2.5rem' }}>
          <h1 className="text-base font-normal mb-3 opacity-90">
            Hackers TOEFL Chapter 1
          </h1>
          <div className="text-5xl font-light tracking-wider">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="px-6" style={{ paddingBottom: '2.5rem' }}>
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

        {/* Main Control Buttons */}
        <div className="grid grid-cols-5 gap-2.5 px-4" style={{ paddingBottom: '2rem' }}>
          <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <ChevronLeft size={24} />
          </button>
          <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <Rewind size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition"
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
          </button>
          <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <FastForward size={24} />
          </button>
          <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Control Grid - 2 rows combined */}
        <div className="px-4" style={{ paddingBottom: '2rem' }}>
          <div className="grid grid-cols-5 gap-2.5" style={{ gridTemplateRows: "auto auto" }}>
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
                background: `linear-gradient(to top, #14b8a6 ${((speedValue - 0.5) / 2.5) * 100}%, #475569 ${((speedValue - 0.5) / 2.5) * 100}%)`,
                gridRow: "1 / 3",
                borderRadius: "1rem",
              }}
            >
              <Gauge size={18} className="z-10 mb-1" />
              <span className="text-xs font-semibold z-10">{speedValue.toFixed(1)}x</span>
            </div>

            {/* Row 1: Repeat, x5, x10/inf */}
            <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition">
              <Repeat size={20} />
            </button>
            <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-xs font-semibold">
              x5
            </button>
            <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex flex-col items-center justify-center transition text-[10px] font-semibold">
              <span>x10</span>
              <span className="text-[8px]">inf</span>
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

        {/* Number Buttons */}
        <div className="grid grid-cols-5 gap-2.5 px-4" style={{ paddingBottom: '2.5rem' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className="bg-rose-300/80 hover:bg-rose-300 text-slate-700 p-3.5 rounded-xl text-lg font-bold transition"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Bottom Display Area */}
        <div className="bg-slate-200 px-4 pt-3 pb-4">
          <div className="text-slate-800">
            <div className="text-base font-bold">&apos;불리&apos; Best of Best 향수</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-rose-500 font-semibold">LIVE쇼핑</span>
              <span>역대급 ~25% 할인 &gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
