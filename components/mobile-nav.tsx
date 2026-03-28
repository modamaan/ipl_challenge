"use client";

import { useState, useEffect } from "react";
import { Menu, X, Trophy, Swords } from "lucide-react";
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

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`p-2 rounded-md border transition-all ${isOpen ? 'bg-[#c0c1ff] text-[#07006c] border-[#c0c1ff]' : 'bg-[#131b2e] text-[#dae2fd] hover:text-white border-[#2d3449] hover:border-[#c0c1ff]/50 shadow-sm'}`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* FULL SCREEN DROPDOWN MENU */}
      {/* Absolute positioning relative to the nav, bypassing fixed viewport issues */}
      <div 
        className={`absolute top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-[#0b1326] border-t border-[#171f33] flex flex-col overflow-y-auto transition-all duration-300 origin-top z-[999] ${
          isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
        }`}
      >
           <div className="p-6 bg-[#131b2e]/30 border-b border-[#2d3449]">
              <div className="text-[#908fa0] text-[10px] uppercase font-black tracking-widest mb-2">Welcome Back</div>
              <div className="text-white font-bold text-lg truncate mb-5">{userName}</div>
              
              <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="bg-[#171f33] border border-[#ffb95f]/30 rounded-xl p-4 flex justify-between items-center group shadow-[0_0_20px_rgba(255,185,95,0.08)]">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ffb95f]/20 flex items-center justify-center">
                       <Trophy className="w-4 h-4 text-[#ffb95f]" />
                    </div>
                    <span className="text-[#dae2fd] text-xs font-black uppercase tracking-widest">Total Points</span>
                 </div>
                 <span className="text-white font-black text-2xl tracking-wider">{userPoints}</span>
              </Link>
           </div>

           <div className="px-6 py-8 flex flex-col gap-4 flex-1">
              <div className="text-[#908fa0] text-[10px] uppercase font-black tracking-[0.2em] mb-2 px-1">Quick Links</div>
              
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-white hover:text-[#c0c1ff] p-4 bg-[#131b2e] rounded-xl border border-[#2d3449] transition-colors shadow-sm">
                 <Swords className="w-5 h-5 text-[#c0c1ff]" />
                 <span className="font-bold tracking-widest uppercase text-sm">Arena Dashboard</span>
              </Link>
              
              <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-white hover:text-[#ffb95f] p-4 bg-[#131b2e] rounded-xl border border-[#2d3449] transition-colors shadow-sm">
                 <Trophy className="w-5 h-5 text-[#ffb95f]" />
                 <span className="font-bold tracking-widest uppercase text-sm">Global Hall of Fame</span>
              </Link>
           </div>

           <div className="p-6 mt-auto border-t border-[#171f33] bg-[#0b1326]">
              <div onClick={() => setIsOpen(false)} className="w-full flex justify-center bg-[#131b2e] rounded-xl border border-[#2d3449] p-3 hover:bg-[#171f33] transition-colors shadow-inner">
                 {signOutButton}
              </div>
           </div>
      </div>
    </div>
  );
}
