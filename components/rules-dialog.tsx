"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function RulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-[#131b2e] hover:bg-[#171f33] border border-[#2d3449] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:border-[#464554] w-full sm:w-auto justify-center">
          View Rules
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#0b1326] border-[#2d3449] text-white">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-wider text-xl text-[#c0c1ff]">
            Tournament Rules
          </DialogTitle>
          <DialogDescription className="text-[#908fa0]">
            How to play and win in the IPL Challenge arena.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="bg-[#131b2e] border border-[#2d3449] p-4 rounded-xl">
            <h4 className="text-[#ffb95f] font-black uppercase tracking-widest text-xs mb-2">1. Lock Your Prediction</h4>
            <p className="text-sm font-medium text-[#dae2fd]">Choose the match winner, toss winner, total runs bracket, top scorer, and your boldest player performance prediction.</p>
          </div>
          <div className="bg-[#131b2e] border border-[#2d3449] p-4 rounded-xl">
            <h4 className="text-[#ffb0cd] font-black uppercase tracking-widest text-xs mb-2">2. Challenge Rivals</h4>
            <p className="text-sm font-medium text-[#dae2fd]">Once your prediction is locked, spin up a VS Challenge against a friend or the global lobby to multiply points.</p>
          </div>
          <div className="bg-[#131b2e] border border-[#2d3449] p-4 rounded-xl">
            <h4 className="text-[#a0a5ff] font-black uppercase tracking-widest text-xs mb-2">3. Climb the Matrix</h4>
            <p className="text-sm font-medium text-[#dae2fd]">After the match resolves, points are successfully distributed. Reach the top of the Global Hall of Fame.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
