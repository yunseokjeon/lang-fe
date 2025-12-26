import { Download, Menu } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 text-white">
      <button className="p-2 hover:bg-white/10 rounded-lg transition">
        <Download size={20} />
      </button>
      <button className="p-2 hover:bg-white/10 rounded-lg transition">
        <Menu size={24} />
      </button>
    </div>
  );
}
