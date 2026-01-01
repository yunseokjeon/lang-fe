export interface MarkerSlot {
  markerA: number;
  markerB: number;
}

interface NumberButtonsProps {
  selectedSlot: number;
  slots: Record<number, MarkerSlot | null>;
  onSlotSelect: (slot: number) => void;
  onSetMarkerA: (time: number) => void;
  onSetMarkerB: (time: number) => void;
}

export default function NumberButtons({
  selectedSlot,
  slots,
  onSlotSelect,
  onSetMarkerA,
  onSetMarkerB,
}: NumberButtonsProps) {
  const handleSlotClick = (slot: number) => {
    const savedData = slots[slot];

    if (savedData) {
      // 저장된 값이 있으면 마커 위치 복원
      onSetMarkerA(savedData.markerA);
      onSetMarkerB(savedData.markerB);
    }
    // 저장된 값이 없으면 useEffect에서 현재 마커 위치가 자동 저장됨

    onSlotSelect(slot);
  };

  return (
    <div
      className="grid grid-cols-5 gap-2.5 px-4"
      style={{ paddingBottom: "2.5rem" }}
    >
      {[1, 2, 3, 4, 5].map((num) => {
        const isSelected = selectedSlot === num;
        const hasSavedData = slots[num] !== null;

        return (
          <button
            key={num}
            onClick={() => handleSlotClick(num)}
            className={`p-3.5 rounded-xl text-lg font-bold transition ${
              isSelected
                ? "bg-rose-500 text-white ring-2 ring-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                : hasSavedData
                  ? "bg-rose-300 hover:bg-rose-400 text-slate-700"
                  : "bg-rose-300/50 hover:bg-rose-300 text-slate-500"
            }`}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
