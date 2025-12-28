import { formatTime } from "../utils/time";

interface TimeDisplayProps {
  currentTime: number;
  fileName: string | null;
  hasFile: boolean;
}

export default function TimeDisplay({ currentTime, fileName, hasFile }: TimeDisplayProps) {
  return (
    <div
      className="text-center text-white px-6"
      style={{ paddingBottom: "2.5rem" }}
    >
      <h1 className="text-base font-normal mb-3 opacity-90">
        {fileName || "Please upload a file"}
      </h1>
      <div className="text-5xl font-light tracking-wider">
        {hasFile ? formatTime(currentTime) : ""}
      </div>
    </div>
  );
}
