import { useRef } from "react";

export const useVolumeDrag = (
  volumeValue: number,
  setVolumeValue: (value: number) => void
) => {
  const volumeRef = useRef<HTMLDivElement>(null);

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

  return { volumeRef, handleVolumeDrag };
};

export const useSpeedDrag = (
  speedValue: number,
  setSpeedValue: (value: number) => void
) => {
  const speedRef = useRef<HTMLDivElement>(null);

  const handleSpeedDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = speedRef.current;
    if (!container) return;

    const updateSpeed = (clientY: number) => {
      const rect = container.getBoundingClientRect();
      const y = clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
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

  return { speedRef, handleSpeedDrag };
};

export const useMarkerDrag = (
  duration: number,
  markerA: number,
  markerB: number,
  setMarkerA: (value: number) => void,
  setMarkerB: (value: number) => void,
  setIsDraggingA: (value: boolean) => void,
  setIsDraggingB: (value: boolean) => void
) => {
  const progressRef = useRef<HTMLDivElement>(null);

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

  return { progressRef, handleMarkerDrag };
};
