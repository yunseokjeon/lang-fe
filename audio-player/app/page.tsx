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

export interface MediaFile {
  file: File;
  url: string;
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [markerA, setMarkerA] = useState(0);
  const [markerB, setMarkerB] = useState(100);
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);
  const [speedValue, setSpeedValue] = useState(1);
  const [volumeValue, setVolumeValue] = useState(40);

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

  // 현재 선택된 파일 정보
  const currentMedia = currentFileIndex !== null ? mediaFiles[currentFileIndex] : null;
  const audioUrl = currentMedia?.url || null;
  const audioFile = currentMedia?.file || null;

  // 파일 업로드 핸들러 (최대 2개)
  const handleFileUpload = (file: File) => {
    if (mediaFiles.length >= 2) {
      alert("최대 2개의 파일만 업로드할 수 있습니다.");
      return;
    }
    const url = URL.createObjectURL(file);
    const newMediaFile: MediaFile = { file, url };
    setMediaFiles((prev) => [...prev, newMediaFile]);

    // 첫 번째 파일이면 자동 선택
    if (mediaFiles.length === 0) {
      setCurrentFileIndex(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // 파일 선택 핸들러 (더블클릭 시)
  const handleSelectFile = (index: number) => {
    if (index === currentFileIndex) return;

    // 재생 중이면 멈춤
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentFileIndex(index);
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
      // 초기 볼륨과 재생 속도 적용
      audioRef.current.volume = volumeValue / 100;
      audioRef.current.playbackRate = speedValue;
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

  // 이전 파일로 이동 (순환)
  const handleSkipPrevious = () => {
    if (mediaFiles.length < 2 || currentFileIndex === null) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const prevIndex = currentFileIndex === 0 ? mediaFiles.length - 1 : currentFileIndex - 1;
    setCurrentFileIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // 다음 파일로 이동 (순환)
  const handleSkipNext = () => {
    if (mediaFiles.length < 2 || currentFileIndex === null) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const nextIndex = currentFileIndex === mediaFiles.length - 1 ? 0 : currentFileIndex + 1;
    setCurrentFileIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // 5초 뒤로 이동
  const handleRewind = () => {
    if (!audioRef.current) return;

    const newTime = currentTime - 5;
    if (newTime < 0) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 5초 앞으로 이동
  const handleFastForward = () => {
    if (!audioRef.current) return;

    const newTime = currentTime + 5;
    if (newTime > duration) {
      audioRef.current.currentTime = duration;
      setCurrentTime(duration);
    } else {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 볼륨 변경 시 오디오에 적용
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  }, [volumeValue]);

  // 재생 속도 변경 시 오디오에 적용
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speedValue;
    }
  }, [speedValue]);

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => URL.revokeObjectURL(media.url));
    };
  }, [mediaFiles]);

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
        <Header
          onFileUpload={handleFileUpload}
          mediaFiles={mediaFiles}
          currentFileIndex={currentFileIndex}
          onSelectFile={handleSelectFile}
        />
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
        <PlaybackControls
          isPlaying={isPlaying}
          setIsPlaying={togglePlayPause}
          hasFile={!!audioFile}
          onSkipPrevious={handleSkipPrevious}
          onSkipNext={handleSkipNext}
          onRewind={handleRewind}
          onFastForward={handleFastForward}
          hasMultipleFiles={mediaFiles.length >= 2}
        />
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
