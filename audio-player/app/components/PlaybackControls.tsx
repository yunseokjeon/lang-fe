import {
  Play,
  Pause,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  hasFile: boolean;
  onSkipPrevious: () => void;
  onSkipNext: () => void;
  onRewind: () => void;
  onFastForward: () => void;
  hasMultipleFiles: boolean;
}

export default function PlaybackControls({
  isPlaying,
  setIsPlaying,
  hasFile,
  onSkipPrevious,
  onSkipNext,
  onRewind,
  onFastForward,
  hasMultipleFiles,
}: PlaybackControlsProps) {
  const handlePlayPause = () => {
    if (!hasFile) return;
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="grid grid-cols-5 gap-2.5 px-4"
      style={{ paddingBottom: "2rem" }}
    >
      <button
        onClick={onSkipPrevious}
        disabled={!hasMultipleFiles}
        className={`${hasMultipleFiles ? 'bg-teal-600/80 hover:bg-teal-600' : 'bg-teal-600/40 cursor-not-allowed'} text-white p-3.5 rounded-xl flex items-center justify-center transition`}
      >
        <SkipBack size={24} />
      </button>
      <button
        onClick={onRewind}
        disabled={!hasFile}
        className={`${hasFile ? 'bg-teal-600/80 hover:bg-teal-600' : 'bg-teal-600/40 cursor-not-allowed'} text-white p-3.5 rounded-xl flex items-center justify-center transition`}
      >
        <Rewind size={24} />
      </button>
      <button
        onClick={handlePlayPause}
        disabled={!hasFile}
        className={`${hasFile ? 'bg-teal-600/80 hover:bg-teal-600' : 'bg-teal-600/40 cursor-not-allowed'} text-white p-3.5 rounded-xl flex items-center justify-center transition`}
      >
        {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
      </button>
      <button
        onClick={onFastForward}
        disabled={!hasFile}
        className={`${hasFile ? 'bg-teal-600/80 hover:bg-teal-600' : 'bg-teal-600/40 cursor-not-allowed'} text-white p-3.5 rounded-xl flex items-center justify-center transition`}
      >
        <FastForward size={24} />
      </button>
      <button
        onClick={onSkipNext}
        disabled={!hasMultipleFiles}
        className={`${hasMultipleFiles ? 'bg-teal-600/80 hover:bg-teal-600' : 'bg-teal-600/40 cursor-not-allowed'} text-white p-3.5 rounded-xl flex items-center justify-center transition`}
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
}
