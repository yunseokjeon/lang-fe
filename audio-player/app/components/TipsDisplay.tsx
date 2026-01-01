import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

const tips = [
  "Drag markers A and B to set a repeat section",
  "Use buttons 1-5 to save and recall sections",
  "Tap x5 or x10 to repeat the section multiple times",
  "Tap Inf for infinite loop playback",
  "Tap ALL to select the entire track",
  "Tap A or B to set a marker at the current position",
  "Drag Volume and Speed controls to adjust",
];

export default function TipsDisplay() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-200 px-4 pt-3 pb-4">
      <div className="flex items-start gap-3">
        <div className="bg-amber-400 p-2 rounded-lg shrink-0">
          <Lightbulb size={18} className="text-white" />
        </div>
        <div className="text-slate-700 min-h-[44px] flex flex-col justify-center">
          <div className="text-xs text-slate-500 font-medium mb-0.5">TIP</div>
          <div
            className={`text-sm font-medium transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {tips[currentTip]}
          </div>
        </div>
      </div>
    </div>
  );
}
