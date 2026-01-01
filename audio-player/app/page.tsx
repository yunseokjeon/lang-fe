"use client";

import { useState, useEffect, useRef } from "react";
import { useVolumeDrag, useSpeedDrag, useMarkerDrag } from "./hooks/useDrag";
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import TimeDisplay from "./components/TimeDisplay";
import ProgressBar from "./components/ProgressBar";
import PlaybackControls from "./components/PlaybackControls";
import ControlGrid from "./components/ControlGrid";
import NumberButtons, { MarkerSlot } from "./components/NumberButtons";
import TipsDisplay from "./components/TipsDisplay";

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
  const [repeatMode, setRepeatMode] = useState<'none' | 'x5' | 'x10' | 'infinite'>('none');
  const [repeatCount, setRepeatCount] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [slots, setSlots] = useState<Record<number, MarkerSlot | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

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

  // 재생 위치 변경 (프로그레스 바 드래그) - A-B 범위 내로 제한
  const handleSeek = (time: number) => {
    const clampedTime = Math.max(markerA, Math.min(markerB, time));
    setCurrentTime(clampedTime);
    if (audioRef.current) {
      audioRef.current.currentTime = clampedTime;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Marker B 지점에 도착했을 때
      if (time >= markerB) {
        if (repeatMode === 'infinite') {
          // 무한 반복: 마커 A로 돌아가서 계속 재생
          audioRef.current.currentTime = markerA;
          setCurrentTime(markerA);
        } else if (repeatMode === 'x5' || repeatMode === 'x10') {
          const maxCount = repeatMode === 'x5' ? 5 : 10;
          const newCount = repeatCount + 1;

          if (newCount >= maxCount) {
            // 목표 횟수 도달: 재생 멈춤 및 모드 초기화
            audioRef.current.pause();
            audioRef.current.currentTime = markerB;
            setCurrentTime(markerB);
            setIsPlaying(false);
            setRepeatMode('none');
            setRepeatCount(0);
          } else {
            // 아직 횟수가 남음: 카운트 증가 및 마커 A로 돌아가서 재생
            setRepeatCount(newCount);
            audioRef.current.currentTime = markerA;
            setCurrentTime(markerA);
          }
        } else {
          // 반복 모드 없음: 재생 멈춤
          audioRef.current.pause();
          audioRef.current.currentTime = markerB;
          setCurrentTime(markerB);
          setIsPlaying(false);
        }
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // 재생/일시정지 토글
  const togglePlayPause = (playing: boolean) => {
    if (!audioRef.current || !audioUrl) return;

    if (playing) {
      // 현재 위치가 A-B 범위 밖이면 markerA에서 시작
      if (currentTime < markerA || currentTime >= markerB) {
        audioRef.current.currentTime = markerA;
        setCurrentTime(markerA);
      }
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

  // 5초 뒤로 이동 (A-B 범위 내로 제한)
  const handleRewind = () => {
    if (!audioRef.current) return;

    const newTime = currentTime - 5;
    const clampedTime = Math.max(markerA, newTime);
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  // 5초 앞으로 이동 (A-B 범위 내로 제한)
  const handleFastForward = () => {
    if (!audioRef.current) return;

    const newTime = currentTime + 5;
    const clampedTime = Math.min(markerB, newTime);
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  // 마커가 currentTime을 지나갈 때만 슬라이더 위치 조정
  useEffect(() => {
    if (!audioRef.current) return;

    if (currentTime < markerA) {
      audioRef.current.currentTime = markerA;
      setCurrentTime(markerA);
    } else if (currentTime > markerB) {
      audioRef.current.currentTime = markerB;
      setCurrentTime(markerB);
    }

    // 마커가 변경되면 반복 카운트 리셋 (x5, x10 모드일 때만)
    if (repeatMode === 'x5' || repeatMode === 'x10') {
      setRepeatCount(0);
    }
  }, [markerA, markerB]);

  // 마커가 변경되면 현재 선택된 슬롯에 저장
  useEffect(() => {
    setSlots((prev) => ({
      ...prev,
      [selectedSlot]: { markerA, markerB },
    }));
  }, [markerA, markerB, selectedSlot]);

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
          repeatMode={repeatMode}
          repeatCount={repeatCount}
          onRepeatModeChange={(mode) => {
            setRepeatMode(mode);
            setRepeatCount(0);
          }}
          duration={duration}
          currentTime={currentTime}
          onSetMarkerA={setMarkerA}
          onSetMarkerB={setMarkerB}
        />
        <NumberButtons
          selectedSlot={selectedSlot}
          slots={slots}
          onSlotSelect={setSelectedSlot}
          onSetMarkerA={setMarkerA}
          onSetMarkerB={setMarkerB}
        />

        {/* Bottom Display Area - Tips */}
        <TipsDisplay />
      </div>
    </div>
  );
}
