import { useRef } from "react";
import { Download, Menu } from "lucide-react";

interface HeaderProps {
  onFileUpload: (file: File) => void;
}

export default function Header({ onFileUpload }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="p-2 hover:bg-white/10 rounded-lg transition"
      >
        <Download size={20} />
      </button>
      <button className="p-2 hover:bg-white/10 rounded-lg transition">
        <Menu size={24} />
      </button>
    </div>
  );
}
