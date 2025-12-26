import { formatTime } from "../utils/time";

interface TimeDisplayProps {
  currentTime: number;
}

export default function TimeDisplay({ currentTime }: TimeDisplayProps) {
  return (
    <div
      className="text-center text-white px-6"
      style={{ paddingBottom: "2.5rem" }}
    >
      <h1 className="text-base font-normal mb-3 opacity-90">
        Hackers TOEFL Chapter 1
      </h1>
      <div className="text-5xl font-light tracking-wider">
        {formatTime(currentTime)}
      </div>
    </div>
  );
}
