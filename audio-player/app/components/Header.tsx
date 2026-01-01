import { useRef, useState } from "react";
import { Upload, Menu, X, Music } from "lucide-react";
import { MediaFile } from "../page";

interface HeaderProps {
  onFileUpload: (file: File) => void;
  mediaFiles: MediaFile[];
  currentFileIndex: number | null;
  onSelectFile: (index: number) => void;
}

export default function Header({
  onFileUpload,
  mediaFiles,
  currentFileIndex,
  onSelectFile,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // input 값 초기화 (같은 파일 다시 선택 가능하게)
    e.target.value = "";
  };

  const handleDoubleClick = (index: number) => {
    onSelectFile(index);
    setIsMenuOpen(false);
  };

  return (
    <>
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
          <Upload size={20} />
        </button>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 파일 목록 모달 */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl w-[320px] max-h-[400px] overflow-hidden shadow-xl" style={{ backgroundColor: "#14b8a6" }}>
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white">Media Files</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-4">
              {mediaFiles.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  <Music size={40} className="mx-auto mb-2 opacity-50" />
                  <p>No files uploaded</p>
                  <p className="text-sm mt-1">Add files using the Upload button</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {mediaFiles.map((media, index) => (
                    <li
                      key={index}
                      onDoubleClick={() => handleDoubleClick(index)}
                      className={`p-3 rounded-xl cursor-pointer transition select-none ${
                        currentFileIndex === index
                          ? "bg-white text-teal-600"
                          : "bg-white/20 hover:bg-white/30 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Music size={18} />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{media.file.name}</p>
                          <p className={`text-xs ${currentFileIndex === index ? "text-teal-500" : "text-white/70"}`}>
                            {(media.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        {currentFileIndex === index && (
                          <span className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">Playing</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {mediaFiles.length > 0 && (
                <p className="text-xs text-white/60 text-center mt-4">
                  Double-click to select a file
                </p>
              )}
              {mediaFiles.length < 2 && (
                <p className="text-xs text-white/60 text-center mt-2">
                  {2 - mediaFiles.length} more file(s) can be added
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
