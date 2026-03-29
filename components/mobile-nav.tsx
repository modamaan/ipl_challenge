"use client";

import { useState, useEffect } from "react";
import { Menu, X, Trophy, Swords, LogOut } from "lucide-react";
import Link from "next/link";

export function MobileNav({ 
  userPoints, 
  userName,
  signOutButton 
}: { 
  userPoints: string;
  userName: string;
  signOutButton: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={`p-2 rounded-md border transition-all ${isOpen ? 'bg-[#c0c1ff] text-[#07006c] border-[#c0c1ff]' : 'bg-[#131b2e] text-[#dae2fd] hover:text-white border-[#2d3449] hover:border-[#c0c1ff]/50 shadow-sm'}`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* FULL-SCREEN SLIDE-DOWN PANEL */}
      <div
        className={`fixed inset-0 top-[80px] z-[999] bg-[#0b1326] border-t border-[#171f33] flex flex-col transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
        style={{ height: "calc(100dvh - 80px)" }}
      >
        {/* User Info + Points */}
        <div className="p-6 bg-[#131b2e]/40 border-b border-[#2d3449] shrink-0">
          <div className="text-[#908fa0] text-[10px] uppercase font-black tracking-widest mb-1">Welcome Back</div>
          <div className="text-white font-bold text-lg truncate mb-5">{userName}</div>

          <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="bg-[#171f33] border border-[#ffb95f]/30 rounded-xl p-4 flex justify-between items-center shadow-[0_0_20px_rgba(255,185,95,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffb95f]/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#ffb95f]" />
              </div>
              <span className="text-[#dae2fd] text-xs font-black uppercase tracking-widest">Total Points</span>
            </div>
            <span className="text-white font-black text-2xl tracking-wider">{userPoints}</span>
          </Link>
        </div>

        {/* Quick Links — scrollable if needed */}
        <div className="px-6 py-8 flex flex-col gap-4 overflow-y-auto flex-1">
          <div className="text-[#908fa0] text-[10px] uppercase font-black tracking-[0.2em] mb-2 px-1">Quick Links</div>

          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-white hover:text-[#c0c1ff] p-4 bg-[#131b2e] rounded-xl border border-[#2d3449] transition-colors shadow-sm active:scale-[0.98]">
            <Swords className="w-5 h-5 text-[#c0c1ff] shrink-0" />
            <span className="font-bold tracking-widest uppercase text-sm">Arena Dashboard</span>
          </Link>

          <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-white hover:text-[#ffb95f] p-4 bg-[#131b2e] rounded-xl border border-[#2d3449] transition-colors shadow-sm active:scale-[0.98]">
            <Trophy className="w-5 h-5 text-[#ffb95f] shrink-0" />
            <span className="font-bold tracking-widest uppercase text-sm">Global Hall of Fame</span>
          </Link>
        </div>

        {/* Sign Out — always pinned at bottom */}
        <div className="shrink-0 p-5 border-t border-[#2d3449] bg-[#0b1326]">
          <div
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-3 bg-[#131b2e] hover:bg-[#1a2338] rounded-xl border border-[#2d3449] hover:border-[#ff6b6b]/30 p-4 transition-colors cursor-pointer active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 text-[#ff6b6b]" />
            {signOutButton}
          </div>
        </div>
      </div>
    </div>
  );
}

