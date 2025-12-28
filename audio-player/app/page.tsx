"use client";

import { useState, useEffect, useRef } from "react";
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [markerA, setMarkerA] = useState(0);
  const [markerB, setMarkerB] = useState(100);
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

  // 파일 업로드 핸들러
  const handleFileUpload = (file: File) => {
    // 이전 URL 정리
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // 오디오 이벤트 핸들러
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const newDuration = audioRef.current.duration;
      setDuration(newDuration);
      // 마커 위치를 새 duration에 맞게 설정
      setMarkerA(0);
      setMarkerB(newDuration);
    }
  };

  // 재생 위치 변경 (프로그레스 바 드래그)
  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // 재생/일시정지 토글
  const togglePlayPause = (playing: boolean) => {
    if (!audioRef.current || !audioUrl) return;

    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(playing);
  };

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-500 flex items-center justify-center p-4">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
        />
      )}
      <div className="w-full max-w-[400px] bg-gradient-to-b from-sky-500 to-sky-600 rounded-3xl shadow-2xl overflow-hidden">
        <Header onFileUpload={handleFileUpload} />
        <TimeDisplay currentTime={currentTime} fileName={audioFile?.name || null} hasFile={!!audioFile} />
        <ProgressBar
          currentTime={currentTime}
          onSeek={handleSeek}
          duration={duration}
          markerA={markerA}
          markerB={markerB}
          isDraggingA={isDraggingA}
          isDraggingB={isDraggingB}
          progressRef={progressRef}
          handleMarkerDrag={handleMarkerDrag}
        />
        <PlaybackControls isPlaying={isPlaying} setIsPlaying={togglePlayPause} hasFile={!!audioFile} />
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
