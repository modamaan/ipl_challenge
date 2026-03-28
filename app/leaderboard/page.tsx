import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Trophy, Medal, Flame, Crown } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function LeaderboardPage() {
  const session = await auth();
  const allUsers = await db.select().from(users).orderBy(desc(users.totalPoints));

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] selection:bg-[#ffb95f] selection:text-[#0b1326] pb-24 overflow-x-hidden w-full">
      {/* NAVBAR */}
      <nav className="border-b border-[#171f33] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center h-[72px]">
           <Link href="/" className="font-['Space_Grotesk',_sans-serif] font-black text-xl tracking-tighter italic text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#c0c1ff] hidden sm:block" /> IPL CHALLENGE
           </Link>
           <div className="flex items-center gap-3 md:gap-8 text-[9px] md:text-xs font-bold tracking-widest text-[#908fa0]">
              <Link href="/dashboard" className="hover:text-white uppercase transition-colors">Arena</Link>
              <span className="text-[#dae2fd] border-b-2 border-[#ffb95f] pb-1 uppercase whitespace-nowrap">Hall of Fame</span>
           </div>
         </div>
      </nav>

      <main className="max-w-[1100px] mx-auto px-6 pt-16">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ffb95f] opacity-5 blur-[100px] pointer-events-none"></div>
          
          <Crown className="w-16 h-16 text-[#ffb95f] mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,185,95,0.4)]" />
          <h1 className="text-4xl md:text-[5rem] font-['Space_Grotesk',_sans-serif] font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#dae2fd] drop-shadow-md leading-[1.1]">
            GLOBAL <span className="text-[#ffb95f] block sm:inline">LEADERBOARD</span>
          </h1>
          <p className="mt-4 text-[#908fa0] text-sm font-bold tracking-[0.2em] uppercase">
            Rankings for Season 12 • Arena Prime
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[80px_1fr_150px] gap-6 px-10 py-4 text-[#908fa0] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#2d3449]/50">
             <div>Rank</div>
             <div>Challenger</div>
             <div className="text-right">Total Points</div>
          </div>

          {/* List */}
          {allUsers.map((u, i) => {
            const isTop3 = i < 3;
            let rankColor = "text-[#dae2fd]";
            let borderStyle = "border-[#2d3449]";
            let bgStyle = "bg-[#131b2e]";

            if (i === 0) {
              rankColor = "text-[#ffb95f]"; // Gold
              borderStyle = "border-[#ffb95f]/50 shadow-[0_0_30px_rgba(255,185,95,0.15)]";
              bgStyle = "bg-gradient-to-r from-[#171f33] to-[#131b2e]";
            } else if (i === 1) {
              rankColor = "text-[#c7c4d7]"; // Silver
              borderStyle = "border-[#c7c4d7]/40 shadow-[0_0_20px_rgba(199,196,215,0.1)]";
              bgStyle = "bg-[#171f33]";
            } else if (i === 2) {
              rankColor = "text-[#ca8100]"; // Bronze
              borderStyle = "border-[#ca8100]/40";
              bgStyle = "bg-[#171f33]";
            }

            const isCurrentUser = session?.user?.id === u.id;

            return (
              <div 
                key={u.id} 
                className={`flex items-center justify-between p-4 sm:px-6 md:px-10 md:py-5 rounded-2xl border ${borderStyle} ${bgStyle} hover:bg-[#222a3d] transition-colors relative overflow-hidden group`}
              >
                {/* Highlight line for current user */}
                {isCurrentUser && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c0c1ff] shadow-[0_0_10px_rgba(192,193,255,0.8)]"></div>
                )}

                <div className="flex items-center gap-3 md:gap-6">
                   {/* Rank Number */}
                   <div className={`font-['Space_Grotesk',_sans-serif] font-black italic text-3xl md:text-4xl w-8 md:w-12 text-center shrink-0 ${rankColor}`}>
                     {i + 1}
                   </div>
                   
                   {/* User Info */}
                   <div className="flex items-center gap-3 md:gap-6">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl relative overflow-hidden bg-[#0b1326] border-2 shrink-0 ${isTop3 ? `border-[${rankColor.replace('text-[', '').replace(']', '')}]` : 'border-[#2d3449]'}`}>
                        {u.image ? (
                           <img src={u.image} alt={u.name!} className="w-full h-full object-cover" />
                        ) : (
                           <div className={`w-full h-full flex items-center justify-center font-['Space_Grotesk',_sans-serif] font-black text-xl md:text-2xl ${rankColor}`}>{u.name?.charAt(0) || "U"}</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                          <span className="font-['Space_Grotesk',_sans-serif] font-bold text-white uppercase tracking-wider text-base md:text-xl truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">{u.name}</span>
                          {isCurrentUser && <span className="bg-[#c0c1ff] text-[#07006c] text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest hidden sm:inline-block">You</span>}
                        </div>
                        <div className="text-[#908fa0] text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.2em] truncate">{i < 3 ? 'Elite Division' : 'Challenger Rank'}</div>
                      </div>
                   </div>
                </div>

                {/* Points */}
                <div className="text-right flex flex-col md:flex-row items-end md:items-center justify-end md:gap-3 shrink-0 ml-2">
                   <div className="text-2xl md:text-3xl font-['Space_Grotesk',_sans-serif] font-black italic text-[#dae2fd] leading-none">{u.totalPoints}</div>
                   <div className="text-[#908fa0] text-[9px] md:text-[10px] uppercase font-bold tracking-widest mt-1 md:mt-0 md:mb-1">PTS</div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
