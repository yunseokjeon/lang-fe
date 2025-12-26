"use client";

import { useState, useEffect } from "react";
import { useVolumeDrag, useSpeedDrag, useMarkerDrag } from "./hooks/useDrag";
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import TimeDisplay from "./components/TimeDisplay";
import ProgressBar from "./components/ProgressBar";
import PlaybackControls from "./components/PlaybackControls";
import ControlGrid from "./components/ControlGrid";
import NumberButtons from "./components/NumberButtons";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1826);
  const [duration] = useState(2506);
  const [markerA, setMarkerA] = useState(742);
  const [markerB, setMarkerB] = useState(1492);
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);
  const [speedValue, setSpeedValue] = useState(1.2);
  const [volumeValue, setVolumeValue] = useState(71);

  const { volumeRef, handleVolumeDrag } = useVolumeDrag(volumeValue, setVolumeValue);
  const { speedRef, handleSpeedDrag } = useSpeedDrag(speedValue, setSpeedValue);
  const { progressRef, handleMarkerDrag } = useMarkerDrag(
    duration,
    markerA,
    markerB,
    setMarkerA,
    setMarkerB,
    setIsDraggingA,
    setIsDraggingB
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-500 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-gradient-to-b from-sky-500 to-sky-600 rounded-3xl shadow-2xl overflow-hidden">
        <Header />
        <TimeDisplay currentTime={currentTime} />
        <ProgressBar
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          markerA={markerA}
          markerB={markerB}
          isDraggingA={isDraggingA}
          isDraggingB={isDraggingB}
          progressRef={progressRef}
          handleMarkerDrag={handleMarkerDrag}
        />
        <PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        <ControlGrid
          volumeValue={volumeValue}
          speedValue={speedValue}
          volumeRef={volumeRef}
          speedRef={speedRef}
          handleVolumeDrag={handleVolumeDrag}
          handleSpeedDrag={handleSpeedDrag}
        />
        <NumberButtons />

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
