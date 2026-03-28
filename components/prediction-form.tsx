"use client";

import { useState } from "react";
import { submitPrediction } from "@/app/actions";
import { Loader2 } from "lucide-react";

export function PredictionForm({ match, challengeId }: { match: any, challengeId?: string }) {
  const [tossWinner, setTossWinner] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [totalRuns, setTotalRuns] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <form action={async (fd) => { 
      setLoading(true); 
      setErrorMsg(null);
      const res = await submitPrediction(fd); 
      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      }
    }} className="space-y-12">
      <input type="hidden" name="matchId" value={match.id} />
      {challengeId && <input type="hidden" name="challengeId" value={challengeId} />}
      <input type="hidden" name="tossWinner" value={tossWinner} />
      <input type="hidden" name="matchResult" value={matchResult} />
      <input type="hidden" name="totalRuns" value={totalRuns} />

      {/* 1. TOSS WINNER */}
      <div>
        <h3 className="text-[#dae2fd] font-['Space_Grotesk',_sans-serif] font-black text-xl italic uppercase tracking-wider mb-5 flex items-center gap-4">
          <span className="w-8 h-8 rounded-md bg-[#2d3449] flex items-center justify-center text-[#ffb0cd] shadow-inner text-[15px] not-italic">1</span> 
          Toss Winner
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 md:ml-12 mt-4 md:mt-0">
          {[match.team1, match.team2].map(t => (
            <button key={t} type="button" onClick={() => setTossWinner(t)} className={`py-5 rounded-xl border-2 font-['Space_Grotesk',_sans-serif] font-black tracking-widest text-lg uppercase transition-all shadow-md ${tossWinner === t ? 'bg-[#171f33] border-[#c0c1ff] text-[#c0c1ff] shadow-[0_0_20px_rgba(192,193,255,0.15)]' : 'bg-[#0b1326] border-[#2d3449] text-[#908fa0] hover:border-[#464554] hover:text-[#dae2fd]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MATCH WINNER */}
      <div>
        <h3 className="text-[#dae2fd] font-['Space_Grotesk',_sans-serif] font-black text-xl italic uppercase tracking-wider mb-5 flex items-center gap-4">
          <span className="w-8 h-8 rounded-md bg-[#2d3449] flex items-center justify-center text-[#ffb0cd] shadow-inner text-[15px] not-italic">2</span> 
          Match Winner
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-0 md:ml-12 mt-4 md:mt-0">
          {[match.team1, match.team2].map(t =>(
            <div key={t} onClick={() => setMatchResult(t)} className={`cursor-pointer p-4 md:p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md ${matchResult === t ? 'bg-[#171f33] border-[#c0c1ff] shadow-[0_0_20px_rgba(192,193,255,0.15)]' : 'bg-[#0b1326] border-[#2d3449] hover:border-[#464554]'}`}>
              <div className="flex items-center gap-3 md:gap-5 w-full sm:w-auto">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-[#131b2e] rounded-lg border border-[#2d3449] shrink-0 flex items-center justify-center font-['Space_Grotesk',_sans-serif] font-black italic text-[#dae2fd] text-lg md:text-xl shadow-inner">{t}</div>
                  <div>
                    <div className="font-['Space_Grotesk',_sans-serif] font-black text-white uppercase tracking-wider text-lg md:text-xl mb-0.5">{t}</div>
                    <div className="text-[9px] md:text-[10px] text-[#908fa0] font-bold tracking-wide uppercase">Win Prob: 50%</div>
                  </div>
              </div>
              <button type="button" className={`w-full sm:w-auto px-5 py-2.5 rounded-md text-xs font-black uppercase tracking-widest transition-colors ${matchResult === t ? 'bg-[#c0c1ff] text-[#07006c]' : 'bg-[#131b2e] text-[#c7c4d7] hover:bg-[#2d3449] hover:text-white border border-[#2d3449]'}`}>Select</button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TOTAL RUNS BRACKET */}
      <div>
        <h3 className="text-[#dae2fd] font-['Space_Grotesk',_sans-serif] font-black text-xl italic uppercase tracking-wider mb-5 flex items-center gap-4">
          <span className="w-8 h-8 rounded-md bg-[#2d3449] flex items-center justify-center text-[#ffb95f] shadow-inner text-[15px] not-italic">3</span> 
          Total Runs Bracket
        </h3>
        <div className="flex bg-[#0b1326] p-1.5 rounded-xl border border-[#2d3449] overflow-x-auto scrollbar-hide shadow-inner ml-0 md:ml-12 mt-4 md:mt-0 snap-x">
          {["<150", "150-170", "171-190", "190+"].map(rb => (
            <button key={rb} type="button" onClick={() => setTotalRuns(rb)} className={`flex-shrink-0 sm:flex-1 px-5 py-4 rounded-lg text-sm font-black uppercase tracking-widest whitespace-nowrap transition-colors snap-center ${totalRuns === rb ? 'bg-[#2d3449] text-[#ffb95f] shadow-md border border-[#464554]' : 'text-[#908fa0] hover:text-[#dae2fd]'}`}>
              {rb}
            </button>
          ))}
        </div>
      </div>

      {/* 4 & 5. TEXT INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 ml-0 md:ml-12 mt-4 md:mt-0">
        <div>
          <h3 className="text-[#dae2fd] font-['Space_Grotesk',_sans-serif] font-black text-xl italic uppercase tracking-wider mb-4 flex items-center gap-4 ml-0 md:-ml-12">
            <span className="w-8 h-8 rounded-md bg-[#2d3449] flex items-center justify-center text-[#c0c1ff] shadow-inner text-[15px] not-italic">4</span> 
            Top Scorer
          </h3>
          <input suppressHydrationWarning name="topScorer" required placeholder="e.g. Virat Kohli" className="w-full bg-[#0b1326] border-2 border-[#2d3449] rounded-xl px-5 py-4 text-white placeholder:text-[#464554] focus:outline-none focus:border-[#c0c1ff] font-bold transition-colors shadow-inner" />
        </div>
        <div>
          <h3 className="text-[#dae2fd] font-['Space_Grotesk',_sans-serif] font-black text-xl italic uppercase tracking-wider mb-4 flex items-center gap-4 ml-0 md:-ml-12">
            <span className="w-8 h-8 rounded-md bg-[#2d3449] flex items-center justify-center text-[#c0c1ff] shadow-inner text-[15px] not-italic">5</span> 
            Player Performance
          </h3>
          <input suppressHydrationWarning name="playerPerf" required placeholder="e.g. Bumrah 3+ Wickets" className="w-full bg-[#0b1326] border-2 border-[#2d3449] rounded-xl px-5 py-4 text-white placeholder:text-[#464554] focus:outline-none focus:border-[#c0c1ff] font-bold transition-colors shadow-inner" />
        </div>
      </div>

      <div className="pt-10 border-t border-[#2d3449] sticky bottom-6 z-20 mt-16 pb-4">
         {errorMsg && (
            <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-4 text-center">
              <span className="font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-wider text-[#ef4444]">{errorMsg}</span>
            </div>
         )}
         <button type="submit" disabled={!tossWinner || !matchResult || !totalRuns || loading} className="w-full bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] hover:from-[#e1e0ff] hover:to-[#c0c1ff] text-[#07006c] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-widest text-[22px] shadow-2xl py-6 rounded-xl transition-all hover:shadow-[0_0_40px_rgba(192,193,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center backdrop-blur-md">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-[#07006c]" /> : "Confirm Prediction"}
         </button>
      </div>
    </form>
  );
}
