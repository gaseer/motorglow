import Link from "next/link";
// import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#C8F135]" />
          <span className="font-bold text-white">MotorGlow</span>
          <span className="text-[#6B6B6B] text-sm">© 2025</span>
        </div>
        <a
          href="https://instagram.com/motorglow"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-[#6B6B6B] hover:text-[#C8F135] transition-colors"
        >
          {/* <Instagram size={18} /> */}
        </a>
      </div>
    </footer>
  );
}
